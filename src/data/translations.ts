export type AppLanguage =
  | 'en' // English
  | 'te' // Telugu
  | 'hi' // Hindi
  | 'ta' // Tamil
  | 'kn' // Kannada
  | 'ml' // Malayalam
  | 'bn' // Bengali
  | 'mr'; // Marathi

export interface LanguageOption {
  code: AppLanguage;
  label: string;
  nativeLabel: string;
  region: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', label: 'English', nativeLabel: 'English', region: 'Pan-India' },
  { code: 'te', label: 'Telugu', nativeLabel: 'తెలుగు', region: 'Telangana & AP' },
  { code: 'hi', label: 'Hindi', nativeLabel: 'हिन्दी', region: 'National / North' },
  { code: 'ta', label: 'Tamil', nativeLabel: 'தமிழ்', region: 'Tamil Nadu' },
  { code: 'kn', label: 'Kannada', nativeLabel: 'ಕನ್ನಡ', region: 'Karnataka' },
  { code: 'ml', label: 'Malayalam', nativeLabel: 'മലയാളം', region: 'Kerala' },
  { code: 'bn', label: 'Bengali', nativeLabel: 'বাংলা', region: 'West Bengal' },
  { code: 'mr', label: 'Marathi', nativeLabel: 'मराठी', region: 'Maharashtra' },
];

export interface TranslationStrings {
  appName: string;
  appSubtitle: string;
  emergencySOS: string;
  emergencySOSSubtitle: string;
  dial112Notice: string;
  hospitalFinder: string;
  smartAmbulance: string;
  medicalProfile: string;
  doctorFinder: string;
  familyTracking: string;
  travellerHealthcare: string;
  settings: string;
  seniorMode: string;
  switchRole: string;
  disclaimerText: string;
  call112Direct: string;
  waitTimes: string;
  bedsAvailable: string;
  consultationFee: string;
  ambulanceDispatch: string;
  preArrivalVitals: string;
  currencySymbol: string;
}

export const TRANSLATIONS: Record<AppLanguage, TranslationStrings> = {
  en: {
    appName: 'AegisCare India',
    appSubtitle: 'Emergency & Smart Healthcare Network',
    emergencySOS: 'EMERGENCY SOS',
    emergencySOSSubtitle: 'Simulated 1-tap rapid dispatch to nearest trauma center',
    dial112Notice: 'In a real-life medical emergency, immediately dial 112 or 108.',
    hospitalFinder: 'Hospital Finder',
    smartAmbulance: 'Smart Ambulance',
    medicalProfile: 'Digital Medical Profile',
    doctorFinder: 'Doctor Finder',
    familyTracking: 'Family Tracking',
    travellerHealthcare: 'Traveller Healthcare',
    settings: 'Settings & Accessibility',
    seniorMode: 'Senior View (60+)',
    switchRole: 'Switch Role',
    disclaimerText: 'Fictional demo data for prototype evaluation only. Not connected to real 112/108 emergency dispatch.',
    call112Direct: 'Emergency Helpline: 112 (India)',
    waitTimes: 'ER Wait Time',
    bedsAvailable: 'Available Beds',
    consultationFee: 'Consultation Fee',
    ambulanceDispatch: 'Ambulance Dispatch',
    preArrivalVitals: 'Pre-Arrival Vitals Telemetry',
    currencySymbol: '₹',
  },
  te: {
    appName: 'ఎజిస్ కేర్ ఇండియా',
    appSubtitle: 'అత్యవసర మరియు స్మార్ట్ ఆరోగ్య నెట్‌వర్క్',
    emergencySOS: 'అత్యవసర సహాయం (SOS)',
    emergencySOSSubtitle: 'సమీపంలోని ట్రామా సెంటర్‌కు 1-ట్యాప్ వేగవంతమైన సహాయం',
    dial112Notice: 'నిజమైన వైద్య అత్యవసర పరిస్థితిలో, వెంటనే 112 లేదా 108 కి కాల్ చేయండి.',
    hospitalFinder: 'ఆసుపత్రుల శోధన',
    smartAmbulance: 'స్మార్ట్ అంబులెన్స్',
    medicalProfile: 'డిజిటల్ మెడికల్ ప్రొఫైల్',
    doctorFinder: 'వైద్యుల వివరాలు',
    familyTracking: 'కుటుంబ భద్రత & ట్రాకింగ్',
    travellerHealthcare: 'ప్రయాణికుల ఆరోగ్య రక్షణ',
    settings: 'సెట్టింగ్‌లు & యాక్సెసిబిలిటీ',
    seniorMode: 'సీనియర్ మోడ్ (60+)',
    switchRole: 'పాత్ర మార్చుకోండి',
    disclaimerText: 'ఇది కేవలం ప్రదర్శన నమూనా మాత్రమే. వాస్తవ 112/108 అత్యవసర సేవలకు అనుసంధానించబడలేదు.',
    call112Direct: 'భారతదేశ అత్యవసర నంబర్: 112',
    waitTimes: 'వేచి ఉండే సమయం',
    bedsAvailable: 'లభ్యమయ్యే పడకలు',
    consultationFee: 'కన్సల్టేషన్ ఫీజు',
    ambulanceDispatch: 'అంబులెన్స్ బయలుదేరింది',
    preArrivalVitals: 'రోగి ఆరోగ్య పారామితులు',
    currencySymbol: '₹',
  },
  hi: {
    appName: 'एजिसकेयर इंडिया',
    appSubtitle: 'आपातकालीन एवं स्मार्ट हेल्थकेयर नेटवर्क',
    emergencySOS: 'आपातकालीन सहायता (SOS)',
    emergencySOSSubtitle: 'निकटतम ट्रॉमा सेंटर के लिए 1-टैप त्वरित डिस्पैच',
    dial112Notice: 'वास्तविक आपात स्थिति में तुरंत 112 या 108 पर कॉल करें।',
    hospitalFinder: 'अस्पताल खोजें',
    smartAmbulance: 'स्मार्ट एम्बुलेंस',
    medicalProfile: 'डिजिटल मेडिकल प्रोफाइल',
    doctorFinder: 'डॉक्टर खोजें',
    familyTracking: 'पारिवारिक ट्रैकिंग',
    travellerHealthcare: 'यात्री स्वास्थ्य सहायता',
    settings: 'सेटिंग्स एवं सुगमता',
    seniorMode: 'वरिष्ठ नागरिक मोड (60+)',
    switchRole: 'भूमिका बदलें',
    disclaimerText: 'केवल प्रोटोटाइप मूल्यांकन हेतु काल्पनिक डेमो डेटा। वास्तविक 112/108 सेवा से जुड़ा नहीं है।',
    call112Direct: 'राष्ट्रीय आपातकालीन नंबर: 112 (भारत)',
    waitTimes: 'प्रतीक्षा समय',
    bedsAvailable: 'उपलब्ध बिस्तर',
    consultationFee: 'परामर्श शुल्क',
    ambulanceDispatch: 'एम्बुलेंस डिस्पैच',
    preArrivalVitals: 'पूर्व-आगमन वाइटल्स टेलीमेट्री',
    currencySymbol: '₹',
  },
  ta: {
    appName: 'ஏஜிஸ்கேர் இந்தியா',
    appSubtitle: 'அவசர மற்றும் நவீன மருத்துவ சேவை வலையமைப்பு',
    emergencySOS: 'அவசர உதவி (SOS)',
    emergencySOSSubtitle: 'அருகிலுள்ள அவசர சிகிச்சை மையத்திற்கு உடனடி தகவல்',
    dial112Notice: 'உண்மையான மருத்துவ அவசர நிலையில் உடனடியாக 112 அல்லது 108 ஐ அழைக்கவும்.',
    hospitalFinder: 'மருத்துவமனைகள்',
    smartAmbulance: 'ஸ்மார்ட் ஆம்புலன்ஸ்',
    medicalProfile: 'மருத்துவ விவரக்குறிப்பு',
    doctorFinder: 'மருத்துவர்கள்',
    familyTracking: 'குடும்ப கண்காணிப்பு',
    travellerHealthcare: 'பயணிகள் சுகாதாரம்',
    settings: 'அமைப்புகள் & அணுகல்',
    seniorMode: 'முதியோர் பார்வை (60+)',
    switchRole: 'பயனர் மாற்றம்',
    disclaimerText: 'மாதிரி வடிவமைப்பு தரவு மட்டுமே. உண்மையான 112/108 அவசர நிலையத்துடன் இணைக்கப்படவில்லை.',
    call112Direct: 'இந்திய அவசர எண்: 112',
    waitTimes: 'காத்திருப்பு நேரம்',
    bedsAvailable: 'கிடைக்கும் படுக்கைகள்',
    consultationFee: 'ஆலோசனை கட்டணம்',
    ambulanceDispatch: 'ஆம்புலன்ஸ் புறப்பட்டது',
    preArrivalVitals: 'உயிர் அறிகுறிகள் தகவல்',
    currencySymbol: '₹',
  },
  kn: {
    appName: 'ಏಜಿಸ್‌ಕೇರ್ ಇಂಡಿಯಾ',
    appSubtitle: 'ತುರ್ತು ಮತ್ತು ಸ್ಮಾರ್ಟ್ ಆರೋಗ್ಯ ಸೇವೆಗಳ ನೆಟ್‌ವರ್ಕ್',
    emergencySOS: 'ತುರ್ತು ನೆರವು (SOS)',
    emergencySOSSubtitle: 'ಹತ್ತಿರದ ಆಸ್ಪತ್ರೆಗೆ 1-ಟ್ಯಾಪ್ ತ್ವರಿತ ಸಂದೇಶ ರವಾನೆ',
    dial112Notice: 'ನಿಜವಾದ ವೈದ್ಯಕೀಯ ತುರ್ತು ಸಂದರ್ಭದಲ್ಲಿ ತಕ್ಷಣ 112 ಅಥವಾ 108 ಗೆ ಕರೆ ಮಾಡಿ.',
    hospitalFinder: 'ಆಸ್ಪತ್ರೆಗಳ ಹುಡುಕಾಟ',
    smartAmbulance: 'ಸ್ಮಾರ್ಟ್ ಆಂಬ್ಯುಲೆನ್ಸ್',
    medicalProfile: 'ಡಿಜಿಟಲ್ ವೈದ್ಯಕೀಯ ವಿವರ',
    doctorFinder: 'ವೈದ್ಯರ ಮಾಹಿತಿ',
    familyTracking: 'ಕುಟುಂಬದ ಟ್ರ್ಯಾಕಿಂಗ್',
    travellerHealthcare: 'ಪ್ರವಾಸಿಗರ ಆರೋಗ್ಯ ರಕ್ಷಣೆ',
    settings: 'ಸೆಟ್ಟಿಂಗ್ಸ್ & ಪ್ರವೇಶಸಾಧ್ಯತೆ',
    seniorMode: 'ಹಿರಿಯ ನಾಗರಿಕರ ಮೋಡ್ (60+)',
    switchRole: 'ಪಾತ್ರ ಬದಲಾಯಿಸಿ',
    disclaimerText: 'ಮಾದರಿ ಪರೀಕ್ಷೆಗಾಗಿ ಮಾತ್ರ ಕಾಲ್ಪನಿಕ ಡೇಟಾ. ನಿಜವಾದ 112/108 ನಿಯಂತ್ರಣ ಕೊಠಡಿಗೆ ಸಂಪರ್ಕ ಹೊಂದಿಲ್ಲ.',
    call112Direct: 'ಭಾರತದ ತುರ್ತು ಸಂಖ್ಯೆ: 112',
    waitTimes: 'ಕಾಯುವ ಸಮಯ',
    bedsAvailable: 'ಲಭ್ಯವಿರುವ ಹಾಸಿಗೆಗಳು',
    consultationFee: 'ಸಮಾಲೋಚನಾ ಶುಲ್ಕ',
    ambulanceDispatch: 'ಆಂಬ್ಯುಲೆನ್ಸ್ ರವಾನೆ',
    preArrivalVitals: 'ಆರೋಗ್ಯ ಸೂಚಕಗಳ ಟೆಲಿಮೆಟ್ರಿ',
    currencySymbol: '₹',
  },
  ml: {
    appName: 'എജിസ്‌കെയർ ഇന്ത്യ',
    appSubtitle: 'അടിയന്തര സ്മാർട്ട് ആരോഗ്യ ശൃംഖല',
    emergencySOS: 'അടിയന്തര സഹായം (SOS)',
    emergencySOSSubtitle: 'അടുത്തുള്ള ട്രോമ കെയർ സെന്ററിലേക്ക് അതിവേഗ സഹായം',
    dial112Notice: 'യഥാർത്ഥ അടിയന്തര ഘട്ടങ്ങളിൽ ഉടൻ തന്നെ 112 അല്ലെങ്കിൽ 108 ഡയൽ ചെയ്യുക.',
    hospitalFinder: 'ആശുപത്രികൾ കണ്ടെത്തുക',
    smartAmbulance: 'സ്മാർട്ട് ആംബുലൻസ്',
    medicalProfile: 'ഡിജിറ്റൽ മെഡിക്കൽ പ്രൊഫൈൽ',
    doctorFinder: 'ഡോക്ടർമാരെ കണ്ടെത്തുക',
    familyTracking: 'കുടുംബ സുരക്ഷാ ട്രാക്കിംഗ്',
    travellerHealthcare: 'യാത്രക്കാരുടെ ആരോഗ്യ സുരക്ഷ',
    settings: 'ക്രമീകരണങ്ങൾ',
    seniorMode: 'മുതിർന്ന പൗരന്മാർക്കുള്ള കാഴ്ച (60+)',
    switchRole: 'റോൾ മാറ്റുക',
    disclaimerText: 'പ്രോട്ടോടൈപ്പ് പരിശോധനയ്ക്കുള്ള സാങ്കൽപ്പിക വിവരങ്ങൾ മാത്രം. യഥാർത്ഥ 112 സേവനവുമായി ബന്ധിപ്പിച്ചിട്ടില്ല.',
    call112Direct: 'ദേശീയ അടിയന്തര നമ്പർ: 112 (ഇന്ത്യ)',
    waitTimes: 'കാത്തിരിപ്പ് സമയം',
    bedsAvailable: 'ലഭ്യമായ കിടക്കകൾ',
    consultationFee: 'കൺസൾട്ടേഷൻ ഫീസ്',
    ambulanceDispatch: 'ആംബുലൻസ് പുറപ്പെട്ടു',
    preArrivalVitals: 'ആരോഗ്യ നില വിവരങ്ങൾ',
    currencySymbol: '₹',
  },
  bn: {
    appName: 'এজিসকেয়ার ইন্ডিয়া',
    appSubtitle: 'জরুরি ও স্মার্ট স্বাস্থ্যসেবা নেটওয়ার্ক',
    emergencySOS: 'জরুরি সহায়তা (SOS)',
    emergencySOSSubtitle: 'নিকটতম ট্রমা সেন্টারে ১-ট্যাপে দ্রুত অ্যাম্বুলেন্স প্রেরণ',
    dial112Notice: 'প্রকৃত জরুরি পরিস্থিতিতে অবিলম্বে ১১২ বা ১০৮ নম্বরে ফোন করুন।',
    hospitalFinder: 'হাসপাতাল খুঁজুন',
    smartAmbulance: 'স্মার্ট অ্যাম্বুলেন্স',
    medicalProfile: 'ডিজিটাল মেডিকেল প্রোফাইল',
    doctorFinder: 'ডাক্তার খুঁজুন',
    familyTracking: 'পারিবারিক ট্র্যাকিং',
    travellerHealthcare: 'ভ্রমণকারী স্বাস্থ্যসেবা',
    settings: 'সেটিংস ও অ্যাক্সেসিবিলিটি',
    seniorMode: 'বয়স্ক মোড (৬০+)',
    switchRole: 'ভূমিকা পরিবর্তন',
    disclaimerText: 'কেবলমাত্র প্রোটোটাইপ পরীক্ষার জন্য কাল্পনিক ডেমো তথ্য। আসল ১১২/১০৮ সেবার সাথে যুক্ত নয়।',
    call112Direct: 'ভারতের জাতীয় জরুরি নম্বর: ১১২',
    waitTimes: 'অপেক্ষার সময়',
    bedsAvailable: 'উপলব্ধ বেড',
    consultationFee: 'পরামর্শ ফি',
    ambulanceDispatch: 'অ্যাম্বুলেন্স প্রেরণ',
    preArrivalVitals: 'আগমনের আগের ভাইটালস',
    currencySymbol: '₹',
  },
  mr: {
    appName: 'एजिसकेअर इंडिया',
    appSubtitle: 'आपत्कालीन आणि स्मार्ट आरोग्य सेवा नेटवर्क',
    emergencySOS: 'आपत्कालीन मदत (SOS)',
    emergencySOSSubtitle: 'जवळच्या ट्रॉमा सेंटरसाठी १-टॅप जलद डिस्पॅच',
    dial112Notice: 'प्रत्यक्ष वैद्यकीय आणीबाणीच्या वेळी कृपया त्वरित ११२ किंवा १०८ डायल करा.',
    hospitalFinder: 'रुग्णालये शोधा',
    smartAmbulance: 'स्मार्ट रुग्णवाहिका',
    medicalProfile: 'डिजिटल वैद्यकीय माहिती',
    doctorFinder: 'डॉक्टर शोधा',
    familyTracking: 'कौटुंबिक ट्रॅकिंग',
    travellerHealthcare: 'प्रवासी आरोग्य सेवा',
    settings: 'सेटिंग्ज आणि सुलभता',
    seniorMode: 'ज्येष्ठ नागरिक मोड (६०+)',
    switchRole: 'भूमिका बदला',
    disclaimerText: 'केवळ प्रोटोटाइप चाचणीसाठी काल्पनिक डेटा. प्रत्यक्ष ११२/१०८ सेवेशी जोडलेले नाही.',
    call112Direct: 'भारताचा आपत्कालीन क्रमांक: ११२',
    waitTimes: 'प्रतीक्षा वेळ',
    bedsAvailable: 'उपलब्ध बेड्स',
    consultationFee: 'सल्लागार शुल्क',
    ambulanceDispatch: 'रुग्णवाहिका पाठवली',
    preArrivalVitals: 'रुग्ण आरोग्य माहिती',
    currencySymbol: '₹',
  },
};
