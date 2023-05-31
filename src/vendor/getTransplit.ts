export default async function getTransplit(name: string): Promise<string> {
  try {
    if (!name) return '';
    const ru = `А-а-Б-б-В-в-Ґ-ґ-Г-г-Д-д-Е-е-Ё-ё-Є-є-Ж-ж-З-з-И-и-I-i-Ї
      -ї-Й-й-К-к-Л-л-М-м-Н-н-О-о-П-п-Р-р-С-с-Т-т-У-у-Ф-ф-Х-х
      -Ц-ц-Ч-ч-Ш-ш-Щ-щ-Ъ-ъ-Ы-ы-Ь-ь-Э-э-Ю-ю-Я-я`.split('-');
    const en = `A-a-B-b-V-v-G-g-G-g-D-d-E-e-E-e-E-e-ZH-zh-Z-z-I-i-I-i
      -I-i-J-j-K-k-L-l-M-m-N-n-O-o-P-p-R-r-S-s-T-t-U-u-F-f-H
      -h-TS-ts-CH-ch-SH-sh-SCH-sch-'-'-Y-y-'-'-E-e-YU-yu
      -YA-ya`.split('-');
    let res = '';

    for (let i = 0; i < name.length; i++) {
      const s = name.charAt(i);
      const n = ru.indexOf(s);

      if (n >= 0) {
        res += en[n];
      } else {
        res += s;
      }
    }

    return res.split(' ').join('-').toLocaleLowerCase();
  } catch (e) {
    return '';
  }
}
