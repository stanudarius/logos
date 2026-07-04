import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { supabase } from "../lib/supabase";
import type { Session } from "@supabase/supabase-js";
import type { SavedVaultCard } from "../types/vault";
import type { FeedCard } from "../types/feed";

export function useVault(session: Session | null, trackCardInteraction: (index: number, weight: number) => void) {
  const [savedVaultCards, setSavedVaultCards] = useState<SavedVaultCard[]>([]);
  
  const savedVaultCardsRef = useRef<SavedVaultCard[]>(savedVaultCards);
  savedVaultCardsRef.current = savedVaultCards;
  
  const isAppMounted = useRef(true);
  useEffect(() => {
    isAppMounted.current = true;
    return () => { isAppMounted.current = false; };
  }, []);

  useEffect(() => {
    if (!session?.user) return;
    let isMounted = true;
    const fetchVault = async () => {
      try {
        // Ensure profile exists
        const { data: profile, error: profileError } = await supabase.from('profiles').select('id').eq('id', session.user.id).single();
        if (profileError && profileError.code !== 'PGRST116') {
          console.error("Failed to fetch profile", profileError);
        }
        if (!profile) {
          const { error: insertError } = await supabase.from('profiles').insert([{ id: session.user.id }]);
          if (insertError) console.error("Failed to insert profile", insertError);
        }

        const { data: vault, error: vaultError } = await supabase.from('vault_cards').select('*').eq('user_id', session.user.id);
        if (vaultError) throw vaultError;

        if (vault && isMounted) {
          setSavedVaultCards(vault.map(row => row.card_data as SavedVaultCard));
        }
      } catch (e) {
        console.error("Failed to fetch vault", e);
      }
    };
    
    fetchVault();
    
    return () => { isMounted = false; };
  }, [session]);

  const savedVaultCardIds = useMemo(() => new Set(savedVaultCards.map(c => c.base_id || c.id)), [savedVaultCards]);

  const toggleSaveToVault = useCallback(async (card: FeedCard, index: number) => {
    if (!session?.user || !card) return;
    const cardBaseId = card.base_id || card.id;
    const isSaved = savedVaultCardsRef.current.some(c => (c.base_id || c.id) === cardBaseId);

    if (isSaved) {
      const indexInVault = savedVaultCardsRef.current.findIndex(c => (c.base_id || c.id) === cardBaseId);
      const cardToRemove = savedVaultCardsRef.current[indexInVault];
      setSavedVaultCards(prev => prev.filter(c => (c.base_id || c.id) !== cardBaseId));
      try {
        const { error } = await supabase.from('vault_cards').delete().eq('user_id', session.user.id).eq('card_id', cardToRemove.id);
        if (error) throw error;
      } catch (err) {
        if (cardToRemove && isAppMounted.current) {
          setSavedVaultCards(prev => {
            const next = [...prev];
            next.splice(indexInVault, 0, cardToRemove);
            return next;
          });
        }
      }
    } else {
      const vaultCard: SavedVaultCard = {
        ...card,
        stack_id: card.stack_id || "",
        date_added: new Date().toISOString()
      };
      setSavedVaultCards(prev => [...prev, vaultCard]);
      trackCardInteraction(index, 3);
      try {
        const { error } = await supabase.from('vault_cards').insert([{
          user_id: session.user.id,
          card_id: vaultCard.id,
          card_data: vaultCard
        }]);
        if (error) throw error;
      } catch (err) {
        setSavedVaultCards(prev => prev.filter(c => c.id !== vaultCard.id));
      }
    }
  }, [session, trackCardInteraction]);

  const deleteFromVault = useCallback(async (id: string) => {
    if (!session?.user) return;
    const indexInVault = savedVaultCardsRef.current.findIndex(c => c.id === id);
    const cardToDelete = savedVaultCardsRef.current[indexInVault];
    setSavedVaultCards(prev => prev.filter(c => c.id !== id));
    try {
      const { error } = await supabase.from('vault_cards').delete().eq('user_id', session.user.id).eq('card_id', id);
      if (error) throw error;
    } catch (err) {
      if (cardToDelete && isAppMounted.current) {
        setSavedVaultCards(prev => {
          const next = [...prev];
          next.splice(indexInVault, 0, cardToDelete);
          return next;
        });
      }
    }
  }, [session]);

  const updateVaultCardAnnotation = useCallback(async (id: string, annotation: string) => {
    const cardToUpdate = savedVaultCardsRef.current.find(c => c.id === id);
    if (!cardToUpdate) return;
    const newCardData = { ...cardToUpdate, annotation };
    setSavedVaultCards(prev => prev.map(c => c.id === id ? newCardData : c));
    if (session?.user) {
      try {
        const { error } = await supabase.from('vault_cards').update({ card_data: newCardData }).eq('user_id', session.user.id).eq('card_id', id);
        if (error) throw error;
      } catch (err) {
        setSavedVaultCards(prev => prev.map(c => c.id === id ? cardToUpdate : c));
      }
    }
  }, [session]);

  const assignToFolder = useCallback(async (id: string, folderName: string | undefined) => {
    const cardToUpdate = savedVaultCardsRef.current.find(c => c.id === id);
    if (!cardToUpdate) return;
    const newCardData = { ...cardToUpdate, user_folder: folderName };
    setSavedVaultCards(prev => prev.map(c => c.id === id ? newCardData : c));
    if (session?.user) {
      try {
        const { error } = await supabase.from('vault_cards').update({ card_data: newCardData }).eq('user_id', session.user.id).eq('card_id', id);
        if (error) throw error;
      } catch (err) {
        setSavedVaultCards(prev => prev.map(c => c.id === id ? cardToUpdate : c));
      }
    }
  }, [session]);

  return {
    savedVaultCards,
    savedVaultCardIds,
    toggleSaveToVault,
    deleteFromVault,
    updateVaultCardAnnotation,
    assignToFolder
  };
}
