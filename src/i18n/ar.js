// العربية. Keys mirror en.js exactly, in the same order.
//
// Arabic has six CLDR plural categories. Where all six are natural and
// checkable they are supplied in full; where they are not, the sentence is
// restructured so the count sits apart from the noun and no agreement is
// required. See .claude/skills/codecraft-i18n/SKILL.md.

export default {
  header: {
    breadcrumb: 'مسار التنقّل',
    xp: 'خبرة',
    mute: 'كتم الصوت',
    unmute: 'تشغيل الصوت',
    language: 'اللغة',
  },

  roadmap: {
    title: 'خريطة التعلّم',
    lessonsComplete: {
      zero: 'دروس مكتملة',
      one: 'درس مكتمل',
      two: 'درسان مكتملان',
      few: 'دروس مكتملة',
      many: 'درساً مكتملاً',
      other: 'درس مكتمل',
    },
    inProgress: 'قيد التقدّم',
    locked: 'مقفل',
    lessonCount: {
      zero: 'دروس',
      one: 'درس',
      two: 'درسان',
      few: 'دروس',
      many: 'درساً',
      other: 'درس',
    },
    lockedHint: 'مقفل — أكمل القسم السابق أولاً',
  },

  section: {
    back: 'العودة إلى خريطة التعلّم',
    lockedHint: 'مقفل — أكمل الدرس السابق أولاً',
    xp: 'خبرة',
  },

  lesson: {
    back: 'رجوع',
    prompt: 'اسحب الأسطر إلى ترتيبها الصحيح، ثم تحقّق من إجابتك.',
    xp: 'خبرة',
    dragHandle: 'اسحب لإعادة ترتيب السطر',
    check: 'تحقّق',
    next: 'الدرس التالي',
    backToSection: 'العودة إلى القسم',
    // Restructured: the count is parenthetical, so no noun agreement.
    correct: 'صحيح. جميع الأسطر ({total}) في ترتيبها الصحيح.',
    // Restructured: the count trails the noun as a ratio.
    incorrect: 'أسطر في موضعها الصحيح: {correct} من {total}. حاول مرة أخرى.',
  },

  course: {
    foundations: {
      title: 'أسس بناء الجملة',
      description:
        'التصريحات الحديثة، والدوال السهمية، والقوالب النصية التي تحل محل var ودمج النصوص.',
    },
    'foundations-greet': { title: 'بناء رسالة ترحيب بقالب نصي' },
    'foundations-format-price': { title: 'تنسيق سعر بعملة افتراضية' },
    'foundations-destructure-config': { title: 'تفكيك كائن إعدادات بقيمة افتراضية' },
    'foundations-rest-sum': { title: 'تجميع الوسائط بمعامل الباقي' },

    arrays: {
      title: 'المصفوفات والتفكيك',
      description:
        'تصفية المصفوفات وتحويلها وتفكيكها بدل حلقات for اليدوية.',
    },
    'arrays-filter-map-reduce': { title: 'تصفية قائمة أرقام وتحويلها واختزالها' },
    'arrays-swap-destructure': { title: 'تبديل قيمتين بتفكيك المصفوفة' },
    'arrays-merge-unique': { title: 'دمج مصفوفتين وإزالة التكرار' },
    'arrays-rank-by-score': { title: 'ترتيب اللاعبين حسب النتيجة بـ sort وmap' },

    closures: {
      title: 'الإغلاقات والنطاق',
      description:
        'الإغلاقات، وسلاسل النطاق، والدوال التي تبقى حيّة بعد انتهاء مُستدعيها.',
    },
    'closures-counter': { title: 'إنشاء عدّاد باستخدام إغلاق' },
    'closures-id-generator': { title: 'توليد معرّفات فريدة باستخدام إغلاق' },
    'closures-scope-chain': { title: 'قراءة متغيّر خارجي عبر سلسلة النطاق' },
    'closures-partial-chain': { title: 'بناء سلسلة تطبيق جزئي' },

    async: {
      title: 'جافاسكربت غير المتزامنة',
      description:
        'الوعود وasync/await، أسلوب التحكم في التدفق للشيفرة التي تنتظر عملاً حقيقياً.',
    },
    'async-promise-chain': { title: 'ربط الوعود بـ then' },
    'async-await-basics': { title: 'إعادة كتابة سلسلة وعود بـ async وawait' },
    'async-catch-recover': { title: 'التعافي من وعد مرفوض بـ catch' },
    'async-parallel-all': { title: 'جلب قائمة بالتوازي بـ Promise.all' },

    'advanced-patterns': {
      title: 'أنماط متقدمة',
      description:
        'تقييد الاستدعاء، والتخزين المؤقت للنتائج، والتقسيم، والمولّدات التي تقوم عليها أدوات الإنتاج.',
    },
    'patterns-debounce': { title: 'تقييد تكرار استدعاء دالة (debounce)' },
    'patterns-memoize': { title: 'تخزين نتائج دالة مؤقتاً باستخدام Map' },
    'patterns-curry': { title: 'تقسيم دالة بثلاث وسائط (currying)' },
    'patterns-generator': { title: 'توليد متتالية لا نهائية بتقييم كسول' },
  },
}
