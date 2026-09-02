/* اطلاعات نمونه؛ بعداً همین فایل را با اطلاعات واقعی شجره‌نامه جایگزین می‌کنیم. */
const FAMILY_TREE={rootId:'p1',people:[
{id:'p1',name:'علی',last:'مرادی',gender:'m',birth:'۱۳۲۰',father:null,mother:null,photo:''},
{id:'p2',name:'فاطمه',last:'احمدی',gender:'f',birth:'۱۳۲۵',father:null,mother:null,photo:''},
{id:'p3',name:'مریم',last:'کریمی',gender:'f',birth:'۱۳۳۰',father:null,mother:null,photo:''},
{id:'p4',name:'حسن',last:'مرادی',gender:'m',birth:'۱۳۵۰',father:'p1',mother:'p2',photo:''},
{id:'p5',name:'حسین',last:'مرادی',gender:'m',birth:'۱۳۵۳',father:'p1',mother:'p2',photo:''},
{id:'p6',name:'رضا',last:'مرادی',gender:'m',birth:'۱۳۵۸',father:'p1',mother:'p3',photo:''},
{id:'p7',name:'زهرا',last:'مرادی',gender:'f',birth:'۱۳۶۱',father:'p1',mother:'p3',photo:''},
{id:'p8',name:'سمیه',last:'رضایی',gender:'f',birth:'۱۳۵۲',father:null,mother:null,photo:''},
{id:'p9',name:'امیر',last:'حسن‌زاده',gender:'m',birth:'۱۳۵۰',father:null,mother:null,photo:''},
{id:'p10',name:'علی‌رضا',last:'مرادی',gender:'m',birth:'۱۳۷۵',father:'p4',mother:'p8',photo:''},
{id:'p11',name:'مینا',last:'مرادی',gender:'f',birth:'۱۳۷۸',father:'p4',mother:'p8',photo:''},
{id:'p12',name:'نگار',last:'حسن‌زاده',gender:'f',birth:'۱۳۷۶',father:'p9',mother:null,photo:''}
],unions:[
{id:'u1',a:'p1',b:'p2',label:'همسر اول',children:['p4','p5']},
{id:'u2',a:'p1',b:'p3',label:'همسر دوم',children:['p6','p7']},
{id:'u3',a:'p4',b:'p8',label:'همسر',children:['p10','p11']},
{id:'u4',a:'p9',b:'p4',label:'خانواده',children:['p12']}
]};
