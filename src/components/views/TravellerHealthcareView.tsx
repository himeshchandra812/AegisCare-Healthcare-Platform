import React, { useState } from 'react';
import {
  Globe2,
  Shield,
  Languages,
  Phone,
  AlertCircle,
  FileCheck,
  MapPin,
  Volume2,
} from 'lucide-react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { useApp } from '../../context/AppContext';

export const TravellerHealthcareView: React.FC = () => {
  const { currentLanguage, setCurrentLanguage, supportedLanguages } = useApp();
  const [selectedLang, setSelectedLang] = useState<
    'Telugu' | 'Hindi' | 'Tamil' | 'Kannada' | 'Malayalam' | 'Bengali' | 'Marathi' | 'English'
  >('Telugu');

  const translations = {
    Telugu: {
      langName: 'తెలుగు (Telugu - Telangana & AP)',
      emergencyPhrase: 'నాకు తక్షణ అత్యవసర వైద్య సహాయం కావాలి! నాకు పెన్సిలిన్ మందుల అలర్జీ ఉంది.',
      bloodType: 'రక్త వర్గం: B పాజిటివ్ (B+)',
      chronic: 'దీర్ఘకాలిక సమస్యలు: రక్తపోటు (Hypertension), మధుమేహం (Diabetes)',
      contact: 'అత్యవసర సంప్రదింపు: అర్జున్ రెడ్డి (+91 98480 22334)',
      addressContext: 'స్థానిక ఆసుపత్రి: హైదరాబాద్ అపెక్స్ ట్రామా సెంటర్, మాదాపూర్',
    },
    Hindi: {
      langName: 'हिन्दी (Hindi - National)',
      emergencyPhrase: 'मुझे तत्काल आपातकालीन चिकित्सा सहायता चाहिए! मुझे पेनिसिलिन से गंभीर एलर्जी है।',
      bloodType: 'रक्त समूह: B पॉजिटिव (B+)',
      chronic: 'पुरानी बीमारियाँ: उच्च रक्तचाप (Hypertension), मधुमेह (Diabetes)',
      contact: 'आपातकालीन संपर्क: अर्जुन रेड्डी (+91 98480 22334)',
      addressContext: 'स्थानीय अस्पताल: हैदराबाद एपेक्स ट्रॉमा सेंटर, माधापुर',
    },
    Tamil: {
      langName: 'தமிழ் (Tamil - Tamil Nadu)',
      emergencyPhrase: 'எனக்கு உடனடி அவசர மருத்துவ உதவி தேவை! எனக்கு பென்சிலின் மருந்து ஒவ்வாமை உள்ளது.',
      bloodType: 'இரத்த வகை: B பாசிட்டிவ் (B+)',
      chronic: 'நீண்டகால பாதிப்புகள்: உயர் இரத்த அழுத்தம், சர்க்கரை நோய்',
      contact: 'அவசர தொடர்பு: அர்ஜுன் ரெட்டி (+91 98480 22334)',
      addressContext: 'உள்ளூர் மருத்துவமனை: ஹைதராபாத் அபெக்ஸ் ட்ராமா சென்டர்',
    },
    Kannada: {
      langName: 'ಕನ್ನಡ (Kannada - Karnataka)',
      emergencyPhrase: 'ನನಗೆ ತುರ್ತು ವೈದ್ಯಕೀಯ ನೆರವು ಬೇಕಾಗಿದೆ! ನನಗೆ ಪೆನ್ಸಿಲಿನ್ ಔಷಧಿ ಅಲರ್ಜಿ ಇದೆ.',
      bloodType: 'ರಕ್ತದ ಗುಂಪು: B ಪಾಸಿಟಿವ್ (B+)',
      chronic: 'ದೀರ್ಘಕಾಲಿಕ ಕಾಯಿಲೆಗಳು: ರಕ್ತದೊತ್ತಡ (Hypertension), ಮಧುಮೇಹ',
      contact: 'ತುರ್ತು ಸಂಪರ್ಕ: ಅರ್ಜುನ್ ರೆಡ್ಡಿ (+91 98480 22334)',
      addressContext: 'ಸ್ಥಳೀಯ ಆಸ್ಪತ್ರೆ: ಹೈದರಾಬಾದ್ ಅಪೆಕ್ಸ್ ಟ್ರಾಮಾ ಸೆಂಟರ್',
    },
    Malayalam: {
      langName: 'മലയാളം (Malayalam - Kerala)',
      emergencyPhrase: 'എനിക്ക് അടിയന്തര വൈദ്യസഹായം വേണം! എനിക്ക് പെൻസിലിൻ അലർജിയുണ്ട്.',
      bloodType: 'രക്തഗ്രൂപ്പ്: B പോസിറ്റീവ് (B+)',
      chronic: 'ദീർഘകാല അസുഖങ്ങൾ: ഉയർന്ന രക്തസമ്മർദ്ദം, പ്രമേഹം',
      contact: 'അടിയന്തര കോൺടാക്റ്റ്: അർജുൻ റെഡ്ഡി (+91 98480 22334)',
      addressContext: 'പ്രാദേശിക ആശുപത്രി: ഹൈദരാബാദ് അപെക്സ് ട്രോമ സെന്റർ',
    },
    Bengali: {
      langName: 'বাংলা (Bengali - West Bengal)',
      emergencyPhrase: 'আমার অবিলম্বে জরুরি চিকিৎসা সহায়তা প্রয়োজন! পেনিসিলিন ওষুধে আমার তীব্র অ্যালার্জি রয়েছে।',
      bloodType: 'রক্তের গ্রুপ: B পজিটিভ (B+)',
      chronic: 'দীর্ঘস্থায়ী অসুস্থতা: উচ্চ রক্তচাপ (Hypertension), ডায়াবেটিস',
      contact: 'জরুরি যোগাযোগ: অর্জুন রেড্ডি (+91 98480 22334)',
      addressContext: 'স্থানীয় হাসপাতাল: হায়দ্রাবাদ অ্যাপেক্স ট্রমা সেন্টার',
    },
    Marathi: {
      langName: 'मराठी (Marathi - Maharashtra)',
      emergencyPhrase: 'मला तातडीने आपत्कालीन वैद्यकीय उपचारांची गरज आहे! मला पेनिसिलिनची तीव्र ॲलर्जी आहे.',
      bloodType: 'रक्तगट: B पॉझिटिव्ह (B+)',
      chronic: 'जुने आजार: उच्च रक्तदाब (High BP), मधुमेह (Diabetes)',
      contact: 'आपत्कालीन संपर्क: अर्जुन रेड्डी (+91 98480 22334)',
      addressContext: 'स्थानिक रुग्णालय: हैदराबाद ॲपेक्स ट्रॉमा सेंटर',
    },
    English: {
      langName: 'English (Pan-India Standard)',
      emergencyPhrase: 'I need immediate emergency medical attention! I have a severe penicillin allergy.',
      bloodType: 'Blood Group: B Positive (B+)',
      chronic: 'Chronic Conditions: Hypertension, Type 2 Diabetes',
      contact: 'Emergency Contact: Arjun Reddy (+91 98480 22334)',
      addressContext: 'Local Hospital: Hyderabad Apex Trauma Center, Madhapur',
    },
  };

  const activeCard = translations[selectedLang];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="info" size="md">
              Pan-India Inter-State Healthcare
            </Badge>
            <span className="text-xs text-slate-500 font-medium">8 Languages Supported</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            Traveller Healthcare & Regional Emergency Pass
          </h1>
          <p className="text-sm sm:text-base text-slate-600 mt-1 max-w-2xl">
            Multi-regional Indian language emergency flashcards, Ayushman Bharat & domestic travel health policy sync, and India emergency numbers.
          </p>
        </div>

        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-xs text-emerald-950 font-medium">
          <strong>National Portability:</strong> Ayushman Bharat & Cashless TPA Sync
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Multilingual Medical Translation Card */}
        <Card variant="default" padding="lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <Languages className="w-5 h-5 text-sky-700" />
              <h2 className="text-lg font-bold text-slate-900">
                Indian Regional Language EMT Card
              </h2>
            </div>
            <span className="text-xs text-slate-500 font-medium">Show to local doctors</span>
          </div>

          {/* Regional Language Buttons */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {(
              [
                'Telugu',
                'Hindi',
                'Tamil',
                'Kannada',
                'Malayalam',
                'Bengali',
                'Marathi',
                'English',
              ] as const
            ).map((lang) => (
              <button
                key={lang}
                onClick={() => setSelectedLang(lang)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedLang === lang
                    ? 'bg-sky-800 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>

          {/* Flashcard presentation */}
          <div className="p-4 rounded-xl bg-amber-50 border-2 border-amber-300 text-amber-950 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-amber-900">
              <span>Emergency Statement ({activeCard.langName})</span>
            </div>
            <div className="text-base sm:text-lg font-black text-amber-950 leading-relaxed">
              "{activeCard.emergencyPhrase}"
            </div>
            <div className="pt-2 border-t border-amber-200 text-xs space-y-1 font-semibold">
              <div>{activeCard.bloodType}</div>
              <div>{activeCard.chronic}</div>
              <div>{activeCard.contact}</div>
              <div className="text-amber-800 pt-1">{activeCard.addressContext}</div>
            </div>
          </div>
        </Card>

        {/* Indian Insurance & Policy */}
        <Card variant="default" padding="lg" className="space-y-4">
          <div className="flex items-center gap-2.5 mb-2">
            <Shield className="w-5 h-5 text-emerald-700" />
            <h2 className="text-lg font-bold text-slate-900">
              National Health Insurance & Ayushman Pass
            </h2>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-medium">Provider:</span>
              <span className="font-bold text-slate-900">
                Star Health Senior Citizen Red Carpet / Ayushman Bharat
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-medium">ABHA / Policy ID:</span>
              <span className="font-mono font-bold text-slate-800">SH-IND-99482-LD</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-medium">Sum Insured / Coverage:</span>
              <span className="font-bold text-emerald-700">₹15,00,000 Cashless Hospital Network</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-medium">Emergency TPA Helpline:</span>
              <span className="font-bold text-sky-800">1800 425 2255 (Toll Free)</span>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              India Emergency Numbers (Always Active)
            </h3>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2.5 rounded-lg bg-red-50 border-2 border-red-300 text-red-950">
                <span className="block text-red-700 font-bold">National Emergency</span>
                <span className="font-black text-red-950 text-base">112</span>
              </div>
              <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-300 text-amber-950">
                <span className="block text-amber-700 font-bold">Medical Ambulance</span>
                <span className="font-black text-amber-950 text-base">108</span>
              </div>
              <div className="p-2.5 rounded-lg bg-sky-50 border border-sky-300 text-sky-950">
                <span className="block text-sky-700 font-bold">Senior Citizen Helpline</span>
                <span className="font-black text-sky-950 text-base">14567</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
