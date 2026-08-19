const fs = require('fs');
let c = fs.readFileSync('frontend/src/components/reception/ClinicQueue.jsx', 'utf8');
c = c.replace(/const \[rescheduleItem, setRescheduleItem\] = useState\(null\);\n/g, '');
c = c.replace(/const \[rescheduleData, setRescheduleData\] = useState\(\{ date: '', time: '', doctorId: '' \}\);\n/g, '');
c = c.replace(/const \[isConfirmingReschedule, setIsConfirmingReschedule\] = useState\(false\);\n/g, '');
c = c.replace(/\/\/ Xử lý dời lịch khám[\s\S]*?const handleReschedule = async \(\) => \{[\s\S]*?\} finally \{[\s\S]*?setIsLoading\(false\);[\s\S]*?\}[\s\S]*?\};\n/g, '');
c = c.replace(/<button[^>]*onClick=\{\(\) => \{[^}]*setRescheduleItem\(appt\);[^}]*\}\}[^>]*title="Dời lịch"[\s\S]*?<\/button>/g, '');
c = c.replace(/\{\/\* RESCHEDULE MODAL \*\/\}[\s\S]*?\{\/\* DELETE CONFIRM MODAL \*\/\}/g, '{/* DELETE CONFIRM MODAL */}');
fs.writeFileSync('frontend/src/components/reception/ClinicQueue.jsx', c);
