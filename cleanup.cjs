const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(/import Toast from "\.\/components\/Toast";\r?\n/g, '');
content = content.replace(/ *<Toast message=\{toastMessage\} \/>\r?\n/g, '');
content = content.replace(/ *const \[toastMessage, setToastMessage\] = useState<string \| null>\(null\);\r?\n/g, '');
content = content.replace(/ *const triggerToast = useCallback\(\(msg: string\) => \{\r?\n *setToastMessage\(msg\);\r?\n *setTimeout\(\(\) => setToastMessage\(null\), 2800\);\r?\n *\}, \[\]\);\r?\n/g, '');

content = content.replace(/.*triggerToast\(".*?"\);\r?\n/g, '');
content = content.replace(/.*triggerToast\(`.*?`\);\r?\n/g, '');
content = content.replace(/.*triggerToast\(.*?\);\r?\n/g, '');

content = content.replace(/ *onTriggerToast=\{triggerToast\}\r?\n/g, '');

content = content.replace(/, triggerToast/g, '');
content = content.replace(/triggerToast, /g, '');
content = content.replace(/\[triggerToast\]/g, '[]');

fs.writeFileSync('src/App.tsx', content);
