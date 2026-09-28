(function () {
  // Configuration for all color palettes
  const CONFIG = {
    red: {
      id: "bita-red",
      colors: [
        { hex: "#280000", name: "سرخ‌متمایل سیاه" },
        { hex: "#310000", name: "مخملی" },
        { hex: "#380001", name: "قرمز بسیار تیره مایل به مشکی" },
        { hex: "#3A0000", name: "عمیق" },
        { hex: "#430000", name: "قرمز شب" },
        { hex: "#4D0000", name: "غلیظ" },
        { hex: "#580000", name: "سوخته" },
        { hex: "#52150E", name: "قرمز-قهوه‌ای بسیار تیره" },
        { hex: "#630000", name: "پرفشار" },
        { hex: "#6D0000", name: "سنگ" },
        { hex: "#780000", name: "یاقوتی" },
        { hex: "#6C1F12", name: "قرمز-قهوه‌ای تیره" },
        { hex: "#800000", name: "مارون" },
        { hex: "#800020", name: "برگاندی" },
        { hex: "#830000", name: "قرمز تیره عمیق" },
        { hex: "#8B0000", name: "قرمز تیره" },
        { hex: "#722F37", name: "شرابی" },
        { hex: "#8D0000", name: "قرمز شرابی تیره" },
        { hex: "#872817", name: "قرمز خاکی تیره" },
        { hex: "#980000", name: "تیره" },
        { hex: "#A20000", name: "شدت" },
        { hex: "#AD0000", name: "آجر" },
        { hex: "#B80000", name: "سنگین" },
        { hex: "#A8311C", name: "قرمز آجری تیره" },
        { hex: "#B22222", name: "قرمز آجری" },
        { hex: "#C30000", name: "عمق" },
        { hex: "#CC0000", name: "ریشه" },
        { hex: "#D90000", name: "قوی" },
        { hex: "#C83A22", name: "آتشِ عمیق" },
        { hex: "#CC3333", name: "قرمز ایرانی" },
        { hex: "#DC143C", name: "قرمز کریمسون" },
        { hex: "#E60000", name: "گرم" },
        { hex: "#E0432A", name: "روشن-گرم" },
        { hex: "#CD5C5C", name: "قرمز هندی" },
        { hex: "#FF0000", name: "قرمز" },
        { hex: "#FF0A0A", name: "تند" },
        { hex: "#FF1111", name: "برجسته" },
        { hex: "#FF1919", name: "اصلی" },
        { hex: "#FF1F1F", name: "صِرف" },
        { hex: "#FF2626", name: "گوجه‌ای" },
        { hex: "#FF2E2E", name: "آتشی" },
        { hex: "#FF3131", name: "قرمز نئونی" },
        { hex: "#FF3535", name: "پرنشاط" },
        { hex: "#FF3B3B", name: "شورانگیز" },
        { hex: "#FF4747", name: "روان" },
        { hex: "#FF4C30", name: "قرمز-نارنجی روشن" },
        { hex: "#FF5252", name: "مدرن" },
        { hex: "#FF5F3F", name: "قرمز گوجه‌ای پررنگ" },
        { hex: "#FF5F5F", name: "شاداب" },
        { hex: "#FF6347", name: "قرمز گوجه‌ای" },
        { hex: "#FF6B6B", name: "مرجانی نئونی" },
        { hex: "#FF6D6D", name: "جوان" },
        { hex: "#FF724F", name: "آتش" },
        { hex: "#F08080", name: "مرجانی روشن" },
        { hex: "#FF7A7A", name: "پوست" },
        { hex: "#FF8888", name: "نرم" },
        { hex: "#FF9595", name: "لطیف" },
        { hex: "#FF9A6B", name: "انبه‌ای" },
        { hex: "#FFA3A3", name: "ملایم" },
        { hex: "#FFB3B3", name: "قرمز پاستلی" },
        { hex: "#FFC2C2", name: "پِتِل" },
        { hex: "#FFCECE", name: "گل رز" },
        { hex: "#FFF0F0", name: "قرمز خیلی روشن" },
      ],
    },
    purple: {
      id: "bita-purple",
      colors: [
        { hex: "#301934", name: "بنفش تیره" },
        { hex: "#32174D", name: "بنفش روسی" },
        { hex: "#32127A", name: "نیلی ایرانی" },
        { hex: "#66023C", name: "بنفش تیریَن" },
        { hex: "#4B0082", name: "نیلی" },
        { hex: "#5B3256", name: "بنفش ژاپنی" },
        { hex: "#512888", name: "بنفش کی‌استیت" },
        { hex: "#800040", name: "ارغوانی شرابی" },
        { hex: "#682860", name: "بنفش پالاتین" },
        { hex: "#563C5C", name: "بنفش انگلیسی" },
        { hex: "#702963", name: "بیزانتیوم" },
        { hex: "#8B004B", name: "موری" },
        { hex: "#614051", name: "بادمجانی" },
        { hex: "#800080", name: "بنفش" },
        { hex: "#6C3082", name: "امیننس" },
        { hex: "#880085", name: "ماردی گراس" },
        { hex: "#663399", name: "بنفش ربکا" },
        { hex: "#8B008B", name: "ماژنتای تیره" },
        { hex: "#6F2DA8", name: "انگوری" },
        { hex: "#8D029B", name: "ماووین" },
        { hex: "#645394", name: "اولترا ویولت" },
        { hex: "#8806CE", name: "ویولت فرانسوی" },
        { hex: "#6F00FF", name: "ایندگو برقی" },
        { hex: "#5A4FCF", name: "زنبق" },
        { hex: "#9400D3", name: "ویولت تیره" },
        { hex: "#7851A9", name: "بنفش سلطنتی" },
        { hex: "#8000FF", name: "بنفش خالص" },
        { hex: "#8A2BE2", name: "آبی بنفش" },
        { hex: "#9932CC", name: "ارکیده تیره" },
        { hex: "#856088", name: "بنفش چینی" },
        { hex: "#B53389", name: "فاندانگو" },
        { hex: "#86608E", name: "پامپ‌اند‌پاور" },
        { hex: "#8F00FF", name: "ویولت الکتریکی" },
        { hex: "#C71585", name: "قرمز بنفش" },
        { hex: "#9A4EAE", name: "پورپورئوس" },
        { hex: "#A020F0", name: "ورونیکا" },
        { hex: "#B026FF", name: "بنفش نئونی" },
        { hex: "#9966CC", name: "آمتیست" },
        { hex: "#BF00FF", name: "بنفش برقی" },
        { hex: "#BA55D3", name: "ارکیده متوسط" },
        { hex: "#9370DB", name: "بنفش متوسط" },
        { hex: "#DF00FF", name: "فلوکس" },
        { hex: "#9683EC", name: "ایندگو گرمسیری" },
        { hex: "#B284BE", name: "بنفش آفریقایی" },
        { hex: "#B57EDC", name: "لاوندر گل‌فام" },
        { hex: "#D473D4", name: "ماو فرانسوی" },
        { hex: "#FF00FF", name: "فوشیا" },
        { hex: "#DA70D6", name: "ارکیده" },
        { hex: "#DF73FF", name: "هلیوتروپ" },
        { hex: "#C8A2C8", name: "یاسی" },
        { hex: "#EE82EE", name: "ویولت" },
        { hex: "#C9A0DC", name: "ویستریا" },
        { hex: "#DDA0DD", name: "آلو" },
        { hex: "#E0B0FF", name: "ماو" },
        { hex: "#D8BFD8", name: "خار بنفش" },
        { hex: "#CCCCFF", name: "پری‌وینکل" },
        { hex: "#E6E6FA", name: "لاوندر وب" },
        { hex: "#FAE6FA", name: "بنفش بسیار کم‌رنگ" },
      ],
    },
    brown: {
      id: "bita-brown",
      colors: [
        { hex: "#260701", name: "قهوه‌ای کهنه" },
        { hex: "#321414", name: "قهوه‌ای شکلاتی بسیار تیره" },
        { hex: "#3D0C02", name: "لوبیای سیاه" },
        { hex: "#381819", name: "قهوه‌ای چوب ماهون" },
        { hex: "#3E2723", name: "قهوه‌ای شکلاتی تیره" },
        { hex: "#3D2B1F", name: "بیستر" },
        { hex: "#3B2F2F", name: "قهوه‌ای سیاه" },
        { hex: "#442D25", name: "قهوه‌ای مجلل" },
        { hex: "#592720", name: "کاپوت مورتوم" },
        { hex: "#4B3621", name: "کافه نویر" },
        { hex: "#4E342E", name: "قهوه‌ای گرم" },
        { hex: "#5C3317", name: "قهوه‌ای بلوطی تیره" },
        { hex: "#663300", name: "قهوه‌ای کلاسیک" },
        { hex: "#5C4033", name: "قهوه‌ای تیره" },
        { hex: "#654321", name: "قهوه‌ای شکلاتی" },
        { hex: "#8B2500", name: "قهوه‌ای سوخته" },
        { hex: "#704214", name: "سپیا" },
        { hex: "#7B3F00", name: "قهوه‌ای موکا" },
        { hex: "#6C4A30", name: "عسلی تیره" },
        { hex: "#734A12", name: "قهوه‌ای بلوطی" },
        { hex: "#6D4C41", name: "قهوه‌ای خاکی" },
        { hex: "#6F4E37", name: "قهوه‌ای قهوه" },
        { hex: "#70543E", name: "قهوه‌ای مدرن" },
        { hex: "#8B4513", name: "قهوه‌ای زینی" },
        { hex: "#A52A2A", name: "قهوه‌ای" },
        { hex: "#795548", name: "قهوه‌ای متوسط" },
        { hex: "#964B00", name: "قهوه‌ای سنتی" },
        { hex: "#7E5E60", name: "قهوه‌ای رز سرد" },
        { hex: "#855E42", name: "قهوه‌ای عسلی تیره" },
        { hex: "#8E593C", name: "قهوه‌ای رز گرم" },
        { hex: "#A0522D", name: "سی‌ینا" },
        { hex: "#826644", name: "آمبر خام" },
        { hex: "#836953", name: "قهوه‌ای طبیعت" },
        { hex: "#A35E35", name: "قهوه‌ای چشم عسلی" },
        { hex: "#9C661F", name: "قهوه‌ای طلایی" },
        { hex: "#8D6E63", name: "قهوه‌ای روشن طبیعی" },
        { hex: "#8E7618", name: "عسلی متوسط" },
        { hex: "#B5651D", name: "قهوه‌ای روشن" },
        { hex: "#987654", name: "قهوه‌ای کهربایی" },
        { hex: "#9B7653", name: "قهوه‌ای طلایی ملایم" },
        { hex: "#A97142", name: "قهوه‌ای خنثی" },
        { hex: "#A97458", name: "قهوه‌ای آجری" },
        { hex: "#A67B5B", name: "کافه‌اوله" },
        { hex: "#B87333", name: "مسی" },
        { hex: "#D2691E", name: "شکلات" },
        { hex: "#A1887F", name: "قهوه‌ای خاکستری" },
        { hex: "#CD7F32", name: "برنز" },
        { hex: "#C68642", name: "کارامل" },
        { hex: "#CD853F", name: "قهوه‌ای پرو" },
        { hex: "#E97451", name: "سی‌ینای سوخته" },
        { hex: "#BC8F8F", name: "قهوه‌ای رز خاکی" },
        { hex: "#C19A6B", name: "شتری" },
        { hex: "#C49E60", name: "قهوه‌ای عسلی" },
        { hex: "#BCAAA4", name: "قهوه‌ای خاکی روشن" },
        { hex: "#C2B280", name: "شنی" },
        { hex: "#C3B091", name: "خاکی بژ" },
        { hex: "#E1A95F", name: "زرد خاکی" },
        { hex: "#F4A460", name: "قهوه‌ای شنی روشن" },
        { hex: "#D2B48C", name: "قهوه‌ای تان" },
        { hex: "#DEB887", name: "برلی وود" },
        { hex: "#E6BE8A", name: "قهوه‌ای شنی" },
        { hex: "#D7CCC8", name: "قهوه‌ای سفید" },
      ],
    },
    blue: {
      id: "bita-blue",
      colors: [
        { hex: "#000C66", name: "آبی تیره عمیق" },
        { hex: "#002147", name: "آبی آکسفورد" },
        { hex: "#000080", name: "سرمه‌ای" },
        { hex: "#0c1844", name: "سرمه‌ای سیر" },
        { hex: "#00008B", name: "آبی تیره" },
        { hex: "#191970", name: "آبی نیمه‌شب" },
        { hex: "#002B59", name: "خودکار آبی" },
        { hex: "#082567", name: "آبی اقیانوسی" },
        { hex: "#000F89", name: "آبی فتالو" },
        { hex: "#002C5F", name: "آبی ناوی تیره" },
        { hex: "#2C2C54", name: "آبی تاریک شب" },
        { hex: "#003366", name: "آبی دریایی" },
        { hex: "#0018A8", name: "آبی پنتون" },
        { hex: "#1B3B6F", name: "آبی ناوی" },
        { hex: "#0033A0", name: "آبی اشباع تیره" },
        { hex: "#0000CD", name: "آبی متوسط" },
        { hex: "#34495E", name: "آبی خاکستری مدرن" },
        { hex: "#483D8B", name: "آبی اسلیت تیره" },
        { hex: "#1C39BB", name: "آبی ایرانی" },
        { hex: "#0E4D92", name: "آبی فولاد تیره" },
        { hex: "#0047AB", name: "آبی کبالت" },
        { hex: "#1F5973", name: "آبی کله غازی" },
        { hex: "#0000FF", name: "آبی" },
        { hex: "#4F42B5", name: "آبی ویولت" },
        { hex: "#2A52BE", name: "آبی سیرولین" },
        { hex: "#1560BD", name: "آبی کلاسیک مات" },
        { hex: "#6050DC", name: "آبی ماژورل" },
        { hex: "#008080", name: "تیل" },
        { hex: "#4D4DFF", name: "آبی نئونی" },
        { hex: "#6A5ACD", name: "آبی اسلیت" },
        { hex: "#007BA7", name: "سیرولین" },
        { hex: "#4169E1", name: "آبی سلطنتی" },
        { hex: "#3A75C4", name: "آبی متوسط روشن" },
        { hex: "#4166F5", name: "آبی روشن سلطنتی" },
        { hex: "#008B8B", name: "سیان تیره" },
        { hex: "#4682B4", name: "آبی فولادی" },
        { hex: "#1F75FE", name: "آبی روشن پرانرژی" },
        { hex: "#7B68EE", name: "آبی اسلیت متوسط" },
        { hex: "#007FFF", name: "آبی آزور" },
        { hex: "#318CE7", name: "آبی فرانسه" },
        { hex: "#0099CC", name: "آبی آکوا" },
        { hex: "#1E90FF", name: "آبی داجر" },
        { hex: "#5F9EA0", name: "آبی کادت" },
        { hex: "#6495ED", name: "آبی کورن‌فلاور" },
        { hex: "#1CA9C9", name: "آبی آرام" },
        { hex: "#20B2AA", name: "سبز دریایی روشن" },
        { hex: "#00AEEF", name: "سیرولین زنده" },
        { hex: "#5DADEC", name: "آبی آسمان" },
        { hex: "#6CB4EE", name: "آبی آسمانی براق" },
        { hex: "#00BFFF", name: "آبی دیپ اسکای" },
        { hex: "#00CCCC", name: "سیان متوسط" },
        { hex: "#9BB7D4", name: "آبی کم‌رنگ ملایم" },
        { hex: "#00CED1", name: "فیروزه‌ای تیره" },
        { hex: "#66CDAA", name: "آکوامارین متوسط" },
        { hex: "#73C2FB", name: "آبی مایا" },
        { hex: "#48D1CC", name: "فیروزه‌ای متوسط" },
        { hex: "#B0C4DE", name: "آبی فولادی روشن" },
        { hex: "#87CEEB", name: "آسمانی" },
        { hex: "#89CFF0", name: "آبی نوزادی" },
        { hex: "#87CEFA", name: "آسمانی روشن" },
        { hex: "#40E0D0", name: "فیروزه‌ای" },
        { hex: "#ADD8E6", name: "آبی روشن" },
        { hex: "#ADD6FF", name: "آبی مهتابی" },
        { hex: "#00F0FF", name: "آبی نئونی روشن" },
        { hex: "#B0E0E6", name: "آبی پودری" },
        { hex: "#00FFFF", name: "سیان" },
        { hex: "#AFEEEE", name: "فیروزه‌ای کم‌رنگ" },
        { hex: "#C6E6FB", name: "آبی برفی" },
        { hex: "#7DF9FF", name: "آبی برقی" },
        { hex: "#7FFFD4", name: "آکوامارین" },
        { hex: "#BFEFFF", name: "آبی روشن ملایم" },
        { hex: "#D4F1F9", name: "آبی یخی" },
        { hex: "#E0FFFF", name: "سیان روشن" },
        { hex: "#F0FFFF", name: "آزور" },
      ],
    },
    pink: {
      id: "bita-pink",
      colors: [
        { hex: "#E30B5C", name: "سرخابی تیره" },
        { hex: "#C54B8C", name: "توتی" },
        { hex: "#DE3163", name: "سریز" },
        { hex: "#CC33CC", name: "صورتی فولادی" },
        { hex: "#997A8D", name: "صورتی مونتباتن" },
        { hex: "#FF007F", name: "سرخابی" },
        { hex: "#E75480", name: "صورتی تیره" },
        { hex: "#D46A7E", name: "صورتی چای‌گل" },
        { hex: "#FF1493", name: "صورتی عمیق" },
        { hex: "#FE28A2", name: "رز ایرانی" },
        { hex: "#DB7093", name: "قرمز-بنفش کم‌رنگ" },
        { hex: "#E4717A", name: "رز شکری" },
        { hex: "#DE6FA1", name: "صورتی ارغوانی" },
        { hex: "#CC8899", name: "پیوس" },
        { hex: "#FF44CC", name: "صورتی نئونی ملایم" },
        { hex: "#FF69B4", name: "صورتی داغ" },
        { hex: "#FF66CC", name: "صورتی نئونی" },
        { hex: "#FF6EB4", name: "صورتی گل رز" },
        { hex: "#FA8072", name: "سالمون" },
        { hex: "#F77FBE", name: "صورتی ایرانی" },
        { hex: "#FF82AB", name: "صورتی رز" },
        { hex: "#FF91A4", name: "صورتی سالمون" },
        { hex: "#E6A6A1", name: "صورتی خاکی" },
        { hex: "#F4A6A6", name: "صورتی مرجانی" },
        { hex: "#DBB2D1", name: "صورتی لاوندر" },
        { hex: "#FBA0E3", name: "صورتی گلدار" },
        { hex: "#FFA6C9", name: "صورتی میخکی" },
        { hex: "#FDAEAE", name: "صورتی قرمزفام" },
        { hex: "#FCB1B1", name: "صورتی نیمه‌تیره" },
        { hex: "#E8BEAC", name: "بژ صورتی روشن" },
        { hex: "#FBAED2", name: "صورتی پاستیلی" },
        { hex: "#F2BAC9", name: "صورتی گلبرگی" },
        { hex: "#FFB6C1", name: "صورتی روشن" },
        { hex: "#FFB7C5", name: "صورتی پنبه‌ای" },
        { hex: "#F8BBD0", name: "صورتی لطیف" },
        { hex: "#F4C2C2", name: "صورتی نرم" },
        { hex: "#F2C1D1", name: "قصه پریان" },
        { hex: "#F9C1C1", name: "صورتی یاقوتی" },
        { hex: "#FFC0CB", name: "صورتی" },
        { hex: "#EEC9D2", name: "صورتی پرنسسی" },
        { hex: "#F7CAC9", name: "صورتی پاستلی" },
        { hex: "#F8C8DC", name: "صورتی پودری" },
        { hex: "#FFCBD7", name: "صورتی گل سرخ" },
        { hex: "#FFCCD5", name: "صورتی کرمی" },
        { hex: "#FFD1DC", name: "صورتی شیرینی" },
        { hex: "#F6D8CE", name: "صورتی هلویی" },
        { hex: "#FFD8D8", name: "صورتی خامه‌ای" },
        { hex: "#FADADD", name: "صورتی کلاسیک" },
        { hex: "#FFD9E8", name: "صورتی ابریشم" },
        { hex: "#FFDCDC", name: "صورتی گرم" },
        { hex: "#FFDBE9", name: "صورتی محو" },
        { hex: "#FFDDF4", name: "صورتی ابر" },
        { hex: "#FFE4E1", name: "صورتی مه‌آلود" },
        { hex: "#FFE5E5", name: "صورتی بسیار روشن" },
        { hex: "#FFEDF3", name: "صورتی کم‌رنگ" },
        { hex: "#FFF0F5", name: "رژگونه لاوندر" },
        { hex: "#FFF5F5", name: "صورتی مرواریدی" },
      ],
    },
    black: {
      id: "bita-black",
      colors: [
        { hex: "#000000", name: "سیاه" },
        { hex: "#010203", name: "سیاه زغال" },
        { hex: "#050505", name: "سیاه کربنی" },
        { hex: "#090909", name: "سیاه نفتی" },
        { hex: "#010B13", name: "سیاه غنی" },
        { hex: "#0C090A", name: "سیاه مخملی" },
        { hex: "#0A0A0A", name: "سیاه خالص" },
        { hex: "#100C08", name: "سیاه دودی" },
        { hex: "#0E0E10", name: "سیاه سایه‌دار" },
        { hex: "#111111", name: "سیاه شب" },
        { hex: "#121212", name: "سیاه صنعتی" },
        { hex: "#141414", name: "سیاه نرم" },
        { hex: "#101820", name: "سیاه چوبی" },
        { hex: "#181818", name: "سیاه متالیک" },
        { hex: "#1B1B1B", name: "سیاه عمیق" },
        { hex: "#1E1E1E", name: "سیاه ابریشمی" },
        { hex: "#242124", name: "سیاه کشمشی" },
        { hex: "#28282B", name: "سیاه سنگی" },
        { hex: "#292929", name: "سیاه دود" },
        { hex: "#2C2C2C", name: "سیاه گرافیتی" },
        { hex: "#2D2D2D", name: "سیاه مات" },
        { hex: "#2E2D2C", name: "سیاه نقره‌ای" },
        { hex: "#333333", name: "خاکستری زغالی تیره" },
        { hex: "#343434", name: "جت" },
        { hex: "#353839", name: "اونیکس" },
        { hex: "#3B3C36", name: "سیاه زیتونی" },
        { hex: "#3C3C3C", name: "سیاه خاکی" },
        { hex: "#483C32", name: "تاپ" },
        { hex: "#444444", name: "سیاه مدرن" },
        { hex: "#4A4A4A", name: "سیاه نرم تیره" },
        { hex: "#505050", name: "سیاه ملایم" },
        { hex: "#565656", name: "سیاه صنعتی روشن" },
        { hex: "#555D50", name: "آبنوس" },
        { hex: "#5C5C5C", name: "سیاه متوسط" },
        { hex: "#606060", name: "سیاه متعادل" },
        { hex: "#666666", name: "سیاه متال نقره‌ای" },
        { hex: "#6B6B6B", name: "سیاه دود صنعتی" },
        { hex: "#707070", name: "سیاه نقره تیره" },
        { hex: "#757575", name: "سیاه خاکستری روشن" },
        { hex: "#7A7A7A", name: "سیاه گچی" },
        { hex: "#858585", name: "سیاه روشن" },
        { hex: "#8A8A8A", name: "سیاه خاکی روشن" },
        { hex: "#8F8F8F", name: "سیاه سرد" },
        { hex: "#949494", name: "سیاه روشن ملایم" },
      ],
    },
    green: {
      id: "bita-green",
      colors: [
        { hex: "#00401A", name: "سبز پاکستان" },
        { hex: "#004225", name: "سبز مسابقه‌ای بریتانیا" },
        { hex: "#004953", name: "سبز نیمه‌شب" },
        { hex: "#014C4F", name: "سبز کله غازی 1" },
        { hex: "#1B4D3E", name: "سبز برانسویک" },
        { hex: "#006400", name: "سبز تیره" },
        { hex: "#355E3B", name: "سبز شکاری" },
        { hex: "#00693E", name: "سبز دارتموث" },
        { hex: "#006869", name: "سبز کله غازی 2" },
        { hex: "#177245", name: "سبز بهاری تیره" },
        { hex: "#556B2F", name: "سبز زیتونی تیره" },
        { hex: "#008000", name: "سبز" },
        { hex: "#317873", name: "سبز مورد" },
        { hex: "#4F7942", name: "سبز سرخس" },
        { hex: "#49796B", name: "سبز هوکر" },
        { hex: "#138808", name: "سبز هند" },
        { hex: "#008183", name: "سبز کله غازی 3" },
        { hex: "#40826D", name: "ویریدین" },
        { hex: "#228B22", name: "سبز جنگلی" },
        { hex: "#6C7C59", name: "سبز رزدا" },
        { hex: "#2E8B57", name: "سبز دریایی" },
        { hex: "#807A3B", name: "عسلی زیتونی" },
        { hex: "#6B8E23", name: "سبز زیتونی خاکی" },
        { hex: "#01996D", name: "سبز نخل" },
        { hex: "#7E8B5A", name: "رگه سبز زیتونی" },
        { hex: "#00A550", name: "سبز پیگمنت" },
        { hex: "#00A86B", name: "یشمی" },
        { hex: "#00A693", name: "سبز ایرانی" },
        { hex: "#8A9A5B", name: "سبز خزه‌ای" },
        { hex: "#7BA05B", name: "سبز مارچوبه" },
        { hex: "#3CB371", name: "سبز دریایی متوسط" },
        { hex: "#3EB489", name: "نعنایی" },
        { hex: "#4CBB17", name: "سبز کلی" },
        { hex: "#67B2B5", name: "سبز کله غازی 4" },
        { hex: "#32CD32", name: "سبز لایم" },
        { hex: "#74C365", name: "سبز مانتیس" },
        { hex: "#50C878", name: "زمردی" },
        { hex: "#9AB973", name: "الیوین" },
        { hex: "#8FBC8F", name: "سبز دریایی تیره" },
        { hex: "#93C572", name: "پسته‌ای" },
        { hex: "#0BDA51", name: "مالاکیت" },
        { hex: "#9ACD32", name: "سبز زرد" },
        { hex: "#55DD33", name: "سبز اس‌جی‌باس" },
        { hex: "#C5D86D", name: "سبز فسفری" },
        { hex: "#ACE1AF", name: "سلادون" },
        { hex: "#00FF00", name: "لایم" },
        { hex: "#00FA9A", name: "سبز بهاری متوسط" },
        { hex: "#90EE90", name: "سبز روشن" },
        { hex: "#00FF40", name: "اِرین" },
        { hex: "#39FF14", name: "سبز نئونی" },
        { hex: "#00FF7F", name: "سبز بهاری" },
        { hex: "#7CFC00", name: "سبز چمنی" },
        { hex: "#00FFBF", name: "سبز آبی روشن" },
        { hex: "#7FFF00", name: "چارتروز" },
        { hex: "#80FF00", name: "چارتروز روشن" },
        { hex: "#76FF7A", name: "سبز جیغ" },
        { hex: "#A7FC00", name: "سبز جوانه" },
        { hex: "#98FB98", name: "سبز کم‌رنگ" },
        { hex: "#64FFDA", name: "سبز آبی ملایم" },
        { hex: "#ADFF2F", name: "سبز-زرد" },
        { hex: "#D0F0C0", name: "سبز چای" },
        { hex: "#BFFF00", name: "لایم چرخه رنگ" },
        { hex: "#E3F988", name: "میندارو" },
      ],
    },
    white: {
      id: "bita-white",
      colors: [
        { hex: "#E3DAC9", name: "استخوانی" },
        { hex: "#EAE0C8", name: "مرواریدی" },
        { hex: "#F0DECB", name: "بژ گرم" },
        { hex: "#E3E3E3", name: "خاکستری مایل به سفید" },
        { hex: "#E5E4E2", name: "پلاتینیوم" },
        { hex: "#FFE4B5", name: "موکاسین" },
        { hex: "#FFE5B4", name: "هلویی" },
        { hex: "#FFE4C4", name: "بیسک" },
        { hex: "#F7E7CE", name: "شامپاینی" },
        { hex: "#F1E9D2", name: "کاغذ پوستی" },
        { hex: "#F0EAD6", name: "پوسته‌تخم‌مرغی" },
        { hex: "#EDEAE0", name: "آلاباستر" },
        { hex: "#EDEDED", name: "سفید مدرن" },
        { hex: "#FAEBD7", name: "سفید آنتیک" },
        { hex: "#FFEBCD", name: "بادامی روشن" },
        { hex: "#F4F0EC", name: "ایزابلا" },
        { hex: "#FAF0E6", name: "کتانی" },
        { hex: "#F5F5DC", name: "بژ" },
        { hex: "#F2F3F4", name: "سفید ضدفلش" },
        { hex: "#F5F5F5", name: "سفید دودی" },
        { hex: "#FFF4E0", name: "کرم عسلی روشن" },
        { hex: "#FDF5E6", name: "توری قدیمی" },
        { hex: "#FFF5E1", name: "کرم بسیار روشن" },
        { hex: "#F7F6F2", name: "شیری لطیف" },
        { hex: "#FFF8C9", name: "وانیلی" },
        { hex: "#F8F4FF", name: "سفید ماگنولیا" },
        { hex: "#E9FFDB", name: "نیانزا" },
        { hex: "#F0F8FF", name: "سفید آلیس" },
        { hex: "#FFF5EE", name: "صدف دریایی" },
        { hex: "#F7F7F7", name: "نمک دریایی" },
        { hex: "#FFF8DC", name: "کورن‌سیلک" },
        { hex: "#FFF8E7", name: "لاته کیهانی" },
        { hex: "#FDF9E6", name: "کرم نرم" },
        { hex: "#FAF9F0", name: "سفید نیمه‌مات" },
        { hex: "#F8F8FF", name: "سفید شبحی" },
        { hex: "#FAF9F6", name: "سفید مایل" },
        { hex: "#FFF8F0", name: "سفید ابری" },
        { hex: "#FFF8F5", name: "کرم گلدار" },
        { hex: "#FFFDD0", name: "کرم" },
        { hex: "#F0FFF0", name: "هانی‌دیو" },
        { hex: "#FAFAFA", name: "سفید مایل به خاکستری" },
        { hex: "#FFFAF0", name: "سفید گل‌دار" },
        { hex: "#FFFAFA", name: "برف" },
        { hex: "#FFFCEF", name: "سفید کره‌ای" },
        { hex: "#FFFDEB", name: "سفید روشن" },
        { hex: "#F5FFFA", name: "کرم نعنایی" },
        { hex: "#FFFDF0", name: "سفید آرام" },
        { hex: "#FDFDFC", name: "سفید خالص" },
        { hex: "#FEFEFA", name: "پودر بچه" },
        { hex: "#FFFFF0", name: "عاج" },
        { hex: "#FEFEFC", name: "سفید صدفی" },
        { hex: "#FFFFFD", name: "سفید کامل" },
        { hex: "#FFFFFF", name: "سفید" },
      ],
    },
    gray: {
      id: "bita-gray",
      colors: [
        { hex: "#0F0F0F", name: "خاکستری کربنی" },
        { hex: "#191919", name: "خاکستری تیره خالص" },
        { hex: "#1C1C1C", name: "خاکستری تیره متالیک" },
        { hex: "#1F1F1F", name: "خاکستری صنعتی" },
        { hex: "#222222", name: "خاکستری مدرن تیره" },
        { hex: "#262626", name: "خاکستری مشکی" },
        { hex: "#2B2B2B", name: "خاکستری عمقی" },
        { hex: "#2F2F2F", name: "خاکستری متال" },
        { hex: "#303030", name: "خاکستری تیره متعادل" },
        { hex: "#2A3439", name: "گان‌متال" },
        { hex: "#383838", name: "خاکستری شهری" },
        { hex: "#3F3F3F", name: "خاکستری سربی" },
        { hex: "#424242", name: "خاکستری مدرن" },
        { hex: "#36454F", name: "زغالی" },
        { hex: "#484848", name: "خاکستری فلزی" },
        { hex: "#2F4F4F", name: "خاکستری اسلیت تیره" },
        { hex: "#4F4F4F", name: "خاکستری زغالی" },
        { hex: "#555555", name: "خاکستری دیوی" },
        { hex: "#4D5D53", name: "فلدگراو" },
        { hex: "#5E5E5E", name: "خاکستری آهنی" },
        { hex: "#536878", name: "خاکستری پِین" },
        { hex: "#696969", name: "خاکستری کم‌نور" },
        { hex: "#6E6E6E", name: "خاکستری متوسط تیره" },
        { hex: "#708090", name: "خاکستری اسلیت" },
        { hex: "#857E6C", name: "عسلی دودی" },
        { hex: "#7F7F7F", name: "خاکستری خالص" },
        { hex: "#808080", name: "خاکستری" },
        { hex: "#6082B6", name: "گلاوکوس" },
        { hex: "#848482", name: "خاکستری کشتی جنگی" },
        { hex: "#778899", name: "خاکستری اسلیت روشن" },
        { hex: "#98817B", name: "سینریوس" },
        { hex: "#8B8589", name: "خاکستری تاپ" },
        { hex: "#8C92AC", name: "خاکستری سرد" },
        { hex: "#999999", name: "خاکستری استاندارد" },
        { hex: "#9E9E9E", name: "خاکستری متوسط" },
        { hex: "#AA98A9", name: "رز کوارتز" },
        { hex: "#91A3B0", name: "خاکستری کادت" },
        { hex: "#A3A3A3", name: "خاکستری پیوتر" },
        { hex: "#A8A8A8", name: "خاکستری دود" },
        { hex: "#A9A9A9", name: "خاکستری تیره" },
        { hex: "#ADADAD", name: "خاکستری روشن مات" },
        { hex: "#B0B0B0", name: "خاکستری نقره‌ای" },
        { hex: "#B3B3B3", name: "خاکستری مه‌ای" },
        { hex: "#B8B8B8", name: "خاکستری یخی" },
        { hex: "#B2BEB5", name: "خاکستری خاکستر" },
        { hex: "#BDBDBD", name: "خاکستری آرام" },
        { hex: "#BEBFC5", name: "خاکستری فرانسوی" },
        { hex: "#C0C0C0", name: "نقره‌ای" },
        { hex: "#C2C2C2", name: "خاکستری ابریشمی" },
        { hex: "#C7C7C7", name: "خاکستری سیلور" },
        { hex: "#C8C8C8", name: "خاکستری روشن متوسط" },
        { hex: "#CCCCCC", name: "خاکستری نقره‌ای روشن" },
        { hex: "#D3D3D3", name: "خاکستری روشن" },
        { hex: "#DBD7D2", name: "تیمبرولف" },
        { hex: "#D9D9D9", name: "خاکستری ابری" },
        { hex: "#DCDCDC", name: "گینزبورو" },
        { hex: "#ECECEC", name: "خاکستری بسیار روشن" },
      ],
    },
    orange: {
      id: "bita-orange",
      colors: [
        { hex: "#BA160C", name: "نارنجی بین‌المللی مهندسی" },
        { hex: "#C04000", name: "ماهاگونی" },
        { hex: "#BF5700", name: "نارنجی سوخته" },
        { hex: "#B56917", name: "چشم ببر" },
        { hex: "#CD5700", name: "تاونی" },
        { hex: "#C46210", name: "نارنجی آلیاژی" },
        { hex: "#E25822", name: "شعله‌ای" },
        { hex: "#F04A00", name: "نارنجی بین‌المللی" },
        { hex: "#E86100", name: "نارنجی اسپانیایی" },
        { hex: "#F94D00", name: "تانجلو" },
        { hex: "#FF4500", name: "قرمز-نارنجی" },
        { hex: "#FF4F00", name: "نارنجی بین‌المللی هوافضا" },
        { hex: "#C5893B", name: "عسلی کهربایی" },
        { hex: "#FF5800", name: "نارنجی پنتون" },
        { hex: "#FF5F1F", name: "نارنجی نئونی" },
        { hex: "#FF6F00", name: "نارنجی آفتابی" },
        { hex: "#D99058", name: "نارنجی ایرانی" },
        { hex: "#FF7518", name: "کدویی" },
        { hex: "#FF7900", name: "نارنجی ایمنی" },
        { hex: "#FA7E00", name: "نارنجی مدرن" },
        { hex: "#F28500", name: "نارنگی" },
        { hex: "#FF7B00", name: "نارنجی بیت‌آموز" },
        { hex: "#E09540", name: "کاراملی" },
        { hex: "#FF8200", name: "نارنجی دانشگاه تگزاس" },
        { hex: "#FF7F50", name: "مرجانی" },
        { hex: "#ED9121", name: "نارنجی هویجی" },
        { hex: "#FF8660", name: "نارنجی گرم" },
        { hex: "#FF8C00", name: "نارنجی تیره" },
        { hex: "#E9967A", name: "سالمون تیره" },
        { hex: "#FF8F00", name: "نارنجی پرینستون" },
        { hex: "#E3A857", name: "زرد هندی" },
        { hex: "#FF9966", name: "نارنگی اتمی" },
        { hex: "#FF9F00", name: "پوست پرتقالی" },
        { hex: "#FFA000", name: "پوست پرتقالی درخشان" },
        { hex: "#FFA500", name: "نارنجی" },
        { hex: "#FFA07A", name: "سالمون روشن" },
        { hex: "#FFA54F", name: "نارنجی ملایم" },
        { hex: "#FFB07A", name: "قرمز نارنجی" },
        { hex: "#E6C280", name: "کرم عسلی" },
        { hex: "#F4C430", name: "زعفرانی" },
        { hex: "#FFBF00", name: "کهربایی" },
        { hex: "#FFC882", name: "هلویی نئونی" },
        { hex: "#FBCEB1", name: "زردآلویی" },
        { hex: "#FED8B1", name: "نارنجی روشن" },
        { hex: "#FFDAB9", name: "هلویی لطیف" },
      ],
    },
    yellow: {
      id: "bita-yellow",
      colors: [
        { hex: "#808000", name: "زیتونی" },
        { hex: "#CC7722", name: "اُخرایی" },
        { hex: "#B8860B", name: "گلدن‌راد تیره" },
        { hex: "#DAA520", name: "گلدن‌راد" },
        { hex: "#EF9B0F", name: "گامبوج" },
        { hex: "#D4A76A", name: "هایلایت طلایی عسلی" },
        { hex: "#D4AF37", name: "طلایی متالیک" },
        { hex: "#BDB76B", name: "خاکی تیره" },
        { hex: "#E6A817", name: "زرد برداشت" },
        { hex: "#CFB53B", name: "طلایی قدیمی" },
        { hex: "#CDB280", name: "اکرو" },
        { hex: "#E0AB76", name: "بوف" },
        { hex: "#E8AC41", name: "زرد هونیادی" },
        { hex: "#F1B42F", name: "زانتوس" },
        { hex: "#FFBA00", name: "زرد انتخابی" },
        { hex: "#DDD06A", name: "سیترون" },
        { hex: "#E4D00A", name: "سیترین" },
        { hex: "#FFC40C", name: "زرد میکادو" },
        { hex: "#F4CA16", name: "جونکیل" },
        { hex: "#FFCC33", name: "سان‌گلو" },
        { hex: "#E9D66B", name: "زرد آریلاید" },
        { hex: "#D1E231", name: "گلابی" },
        { hex: "#E4D96F", name: "کاهی" },
        { hex: "#FFD700", name: "طلایی" },
        { hex: "#FFD800", name: "زرد اتوبوس مدرسه" },
        { hex: "#EEDC82", name: "زرد کتانی" },
        { hex: "#FADA5E", name: "زرد ناپلی" },
        { hex: "#FAD6A5", name: "زرد غروب" },
        { hex: "#FFDB58", name: "خردلی" },
        { hex: "#F8DE7E", name: "یاسمنی" },
        { hex: "#F5DEB3", name: "گندمی" },
        { hex: "#F0E68C", name: "خاکی" },
        { hex: "#FADFAD", name: "زرد هلویی" },
        { hex: "#FFDEAD", name: "سفید ناواهو" },
        { hex: "#EEE8AA", name: "گلدن‌راد کم‌رنگ" },
        { hex: "#FBEC5D", name: "ذرتی" },
        { hex: "#FDEE00", name: "اورئولین" },
        { hex: "#FFEF00", name: "زرد قناری" },
        { hex: "#DFFF00", name: "چارتروز زرد" },
        { hex: "#E3FF00", name: "لیمویی-لایم" },
        { hex: "#FCF75E", name: "ایکترین" },
        { hex: "#FFEFD5", name: "پاپایا ویپ" },
        { hex: "#FFFF00", name: "زرد" },
        { hex: "#FFFF33", name: "زرد نئونی" },
        { hex: "#FFF8C6", name: "زرد خامه‌ای" },
        { hex: "#FAFAD2", name: "زرد گلدن‌راد روشن" },
        { hex: "#FFFAC2", name: "وانیلی روشن" },
        { hex: "#FFFACD", name: "شیفون لیمویی" },
        { hex: "#FFF8E1", name: "کرم ملایم" },
        { hex: "#FFFBE5", name: "زرد کم‌رنگ" },
        { hex: "#FFFFE0", name: "زرد روشن" },
      ],
    },
  };
  function getContrastColor(hex) {
    if (!hex) return "#fff";
    const h = hex.replace("#", "");
    const r = parseInt(h.substr(0, 2), 16),
      g = parseInt(h.substr(2, 2), 16),
      b = parseInt(h.substr(4, 2), 16);
    const yiq = (r * 299 + g * 587 + b * 114) / 1000;

    if (
      h.toLowerCase().includes("fff") ||
      h.toLowerCase().includes("ffe") ||
      h.toLowerCase().includes("ffd")
    ) {
      return yiq > 180 ? "#000" : "#fff";
    }
    return yiq > 150 ? "#000" : "#fff";
  }

  function copyToClipboard(text, copiedElement) {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text.toUpperCase()).then(
          () => {
            showCopiedFeedback(copiedElement);
          },
          () => {
            fallbackCopy(text, copiedElement);
          },
        );
      } else {
        fallbackCopy(text, copiedElement);
      }
    } catch (e) {
      fallbackCopy(text, copiedElement);
    }
  }

  function fallbackCopy(text, copiedElement) {
    try {
      const textArea = document.createElement("textarea");
      textArea.value = text.toUpperCase();
      textArea.style.position = "fixed";
      textArea.style.opacity = "0";
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      showCopiedFeedback(copiedElement);
    } catch (e) {
      copiedElement.textContent = "کپی نشد";
      showCopiedFeedback(copiedElement);
    }
  }

  function showCopiedFeedback(element) {
    element.classList.add("show");
    setTimeout(() => element.classList.remove("show"), 1100);
  }

  function searchColors(colors, query) {
    if (!query) return colors.slice();
    const q = query.trim().toLowerCase().replace("#", "");
    return colors.filter(
      (color) =>
        (color.name && color.name.toLowerCase().includes(q)) ||
        (color.hex && color.hex.replace("#", "").toLowerCase().includes(q)),
    );
  }

  function initializeColorPalette(paletteType) {
    const config = CONFIG[paletteType];
    if (!config) return;

    const grid = document.getElementById(`${config.id}-grid`);
    const search = document.getElementById(`${config.id}-search`);
    const clear = document.getElementById(`${config.id}-clear`);

    if (!grid || !search) return;

    function renderColorList(colors) {
      grid.innerHTML = "";

      if (!colors || colors.length === 0) {
        const emptyElement = document.createElement("div");
        emptyElement.className = "bita-empty";
        emptyElement.textContent = "رنگی یافت نشد.";
        emptyElement.style.cssText =
          "text-align:center;color:#888;padding:10px";
        grid.appendChild(emptyElement);
        return;
      }

      const fragment = document.createDocumentFragment();

      colors.forEach((color) => {
        const tile = document.createElement("div");
        tile.className = "bita-color-tile";
        tile.setAttribute("role", "listitem");
        tile.setAttribute("tabindex", "0");
        tile.setAttribute("aria-label", `${color.name} — ${color.hex}`);
        tile.style.background = color.hex;

        const textColor = getContrastColor(color.hex);
        tile.style.color = textColor;

        const infoDiv = document.createElement("div");
        infoDiv.className = "bita-color-info";
        infoDiv.innerHTML = `
          <div class="bita-color-hex">${color.hex
            .replace("#", "")
            .toUpperCase()}</div>
          <div class="bita-color-name">${color.name}</div>
        `;

        const copiedBadge = document.createElement("div");
        copiedBadge.className = "bita-copied";
        copiedBadge.textContent = "کپی شد";

        tile.addEventListener("click", (e) => {
          e.preventDefault();
          copyToClipboard(color.hex, copiedBadge);
        });

        tile.addEventListener("keydown", (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            copyToClipboard(color.hex, copiedBadge);
          }
        });

        if (textColor === "#000") {
          tile.classList.add("bita-dark-text");
        }

        tile.appendChild(copiedBadge);
        tile.appendChild(infoDiv);
        fragment.appendChild(tile);
      });

      grid.appendChild(fragment);
    }

    search.addEventListener("input", () => {
      const filteredColors = searchColors(config.colors, search.value);
      renderColorList(filteredColors);
    });

    if (clear) {
      clear.addEventListener("click", () => {
        search.value = "";
        renderColorList(config.colors);
        search.focus();
      });
    }

    function tryRender() {
      renderColorList(config.colors);

      setTimeout(() => {
        if (!grid || grid.children.length === 0) {
          const wrapper = document.getElementById(`${config.id}-wrapper`);
          const root = wrapper ? wrapper.parentElement : document.body;

          const mutationObserver = new MutationObserver(
            (mutations, observer) => {
              if (grid && grid.children.length === 0) {
                if (document.body.contains(wrapper || grid)) {
                  renderColorList(config.colors);
                  observer.disconnect();
                }
              } else {
                observer.disconnect();
              }
            },
          );

          mutationObserver.observe(root, { childList: true, subtree: true });
          setTimeout(() => mutationObserver.disconnect(), 5000);
        }
      }, 120);
    }

    tryRender();

    window[`bita_${paletteType}_tool`] = {
      render: () => renderColorList(config.colors),
      search: (query) => {
        search.value = query;
        renderColorList(searchColors(config.colors, query));
      },
    };
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      Object.keys(CONFIG).forEach(initializeColorPalette);
    });
  } else {
    Object.keys(CONFIG).forEach(initializeColorPalette);
  }
})();
