/*
 * داده‌های شجره‌نامه
 * روابط اصلی از تصاویر و اطلاعات ثبت‌شده ساخته شده‌اند.
 * مواردی که نسبت دقیقشان از تصاویر قطعی نبود، در شاخه «سایر بستگان» نگه داشته شده‌اند
 * تا رابطه‌ای به‌صورت حدسی به فرد دیگری نسبت داده نشود.
 */
const FAMILY_TREE = {
  rootId: 'p1',
  people: [
    {id:'p1', name:'جواد', last:'مرادی', gender:'m', birth:'۱۹۹۶', relation:'این تویی', father:'p4', mother:'p5'},
    {id:'p2', name:'جمعه (مولا علی)', last:'لوطکی', gender:'m', relation:'پدربزرگ'},
    {id:'p3', name:'خاتون', last:'رضایی', gender:'f', relation:'مادربزرگ؛ درگذشت: ۲۰۲۰', death:'۲۰۲۰'},
    {id:'p4', name:'گل محمد', last:'مرادی', gender:'m', relation:'پدر', father:'p9', mother:'p27'},
    {id:'p5', name:'عصمت', last:'لوطکی', gender:'f', relation:'مادر', father:'p2', mother:'p3'},
    {id:'p6', name:'عمار', last:'مرادی', gender:'m', birth:'۲۰۱۰', relation:'برادر', father:'p4', mother:'p5'},
    {id:'p7', name:'اسما', last:'مرادی', gender:'f', relation:'خواهر', father:'p4', mother:'p5'},
    {id:'p8', name:'سمیه', last:'مرادی', gender:'f', relation:'خواهر', father:'p4', mother:'p5'},
    {id:'p9', name:'میرزا', last:'مرادی', gender:'m', relation:'پدربزرگ؛ درگذشت: ۱۹۹۸', death:'۱۹۹۸'},
    {id:'p10', name:'ماه گنج', last:'برادویی', gender:'f', relation:'مادربزرگ'},
    {id:'p11', name:'محمود', last:'لوطکی', gender:'m', relation:'عمو'},
    {id:'p12', name:'محمد', last:'لوطکی', gender:'m', relation:'عمو / برادر شوهر'},
    {id:'p13', name:'احمد', last:'لوطکی', gender:'m', relation:'عمو'},
    {id:'p14', name:'حمید', last:'لوطکی', gender:'m', relation:'عمو'},
    {id:'p15', name:'امین', last:'لوطکی', gender:'m', relation:'عمو'},
    {id:'p16', name:'زهرا', last:'لوطکی', gender:'f', relation:'عمه'},
    {id:'p17', name:'مرضیه', last:'لوطکی', gender:'f', relation:'عمه'},
    {id:'p18', name:'پری', last:'لوطکی', gender:'f', relation:'عمه'},
    {id:'p19', name:'افسون', last:'لوطکی', gender:'f', relation:'خواهرزاده'},
    {id:'p20', name:'آمنه', last:'لوطکی', gender:'f', relation:'عمه'},
    {id:'p21', name:'شیردل خان', last:'رضایی', gender:'m', relation:'پدربزرگ'},
    {id:'p22', name:'کام خانی', last:'رضایی', gender:'m', relation:'عموی بزرگ'},
    {id:'p23', name:'رحیم', last:'رضایی', gender:'m', relation:'عموی بزرگ'},
    {id:'p24', name:'خانم', last:'رضایی', gender:'f', relation:'عمه بزرگ'},
    {id:'p25', name:'محمد رضایی', last:'', gender:'m', relation:'برادر ناتنی مادربزرگ'},
    {id:'p26', name:'نرگس', last:'رضایی', gender:'f', relation:'خواهر ناتنی مادربزرگ'},
    {id:'p27', name:'مهری', last:'محمدی', gender:'f', relation:'همسر پدربزرگ'},
    {id:'p28', name:'علم خان', last:'برادویی', gender:'m', relation:'جد بزرگ'},
    {id:'p29', name:'مراد خان', last:'برادویی', gender:'m', relation:'جد مستقیم (۵ نسل)'},
    {id:'p30', name:'نخی', last:'برادویی', gender:'m', relation:'جد مستقیم (۶ نسل)'},
    {id:'p31', name:'رحیمداد', last:'برادویی', gender:'m', relation:'عمو (بزرگ بزرگ پدر بزرگ مادر بزرگ)'},
    {id:'p32', name:'نوشیروان', last:'برادویی', gender:'m', relation:'جد مستقیم (۷ نسل)'},
    {id:'p33', name:'رادو', last:'برادویی', gender:'m', relation:'جد مستقیم (۸ نسل)'},
    {id:'p34', name:'مستان', last:'برادویی', gender:'m', relation:'عمو (بزرگ بزرگ پدر بزرگ بزرگ)'},
    {id:'p35', name:'مرود', last:'برادویی', gender:'m', relation:'عمو (بزرگ بزرگ پدر بزرگ بزرگ)'},
    {id:'p36', name:'عبدالکریم', last:'برادویی', gender:'m', relation:'عمو (بزرگ بزرگ پدر بزرگ بزرگ)'},
    {id:'p37', name:'الو', last:'برادویی', gender:'m', relation:'جد مستقیم (۹ نسل)'},
    {id:'p38', name:'جعفری', last:'برادویی', gender:'m', relation:'عمو، جد مستقیم (۷ نسل)'},
    {id:'p39', name:'هوتک', last:'برادویی', gender:'m', relation:'از شاخه براهویی'},
    {id:'p40', name:'ناشناخته', last:'', gender:'u', relation:'جد مستقیم (۸ یا ۹ نسل)'},
    {id:'p41', name:'ناشناخته ۲', last:'', gender:'u', relation:'جد مستقیم (۶ نسل)'},
    {id:'p42', name:'ناشناخته ۳', last:'', gender:'u', relation:'مادربزرگ'}
  ],
  unions: [
    {id:'u-core', a:'p4', b:'p5', label:'والدین', children:['p1','p6','p7','p8']},
    {id:'u-paternal', a:'p9', b:'p27', label:'خانواده پدری', children:['p4']},
    {id:'u-maternal', a:'p2', b:'p3', label:'خانواده مادری', children:['p5','p11','p12','p13','p14','p15','p16','p17','p18','p20']},
    {id:'u-resayi', a:'p21', b:'p3', label:'همسر / خانواده رضایی', children:[]},
    {id:'u-anc-5', a:'p29', b:'p10', label:'نسل پنجم', children:['p30']},
    {id:'u-anc-6', a:'p30', b:'p41', label:'نسل ششم', children:['p32']},
    {id:'u-anc-7', a:'p32', b:'p38', label:'نسل هفتم / شاخه خویشاوند', children:['p33']},
    {id:'u-anc-8', a:'p33', b:'p40', label:'نسل هشتم', children:['p37']},
    {id:'u-anc-9', a:'p37', b:'p39', label:'نسل نهم / شاخه براهویی', children:[]},
    {id:'u-anc-root', a:'p28', b:'p34', label:'شاخه اجدادی قدیمی', children:['p29','p35','p36']},
    {id:'u-relief', a:'p19', b:'p12', label:'شاخه خواهرزاده', children:[]},
    {id:'u-resayi-siblings', a:'p25', b:'p26', label:'خواهر و برادر ناتنی', children:[]},
    {id:'u-resayi-family', a:'p21', b:'p24', label:'شاخه رضایی', children:['p22','p23']},
    {id:'u-old-branch', a:'p31', b:'p42', label:'شاخه مادربزرگ', children:[]}
  ]
};
