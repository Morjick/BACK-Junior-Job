export default async function getTransplit(name: string): Promise<string> {
  try {
    if (!name) return '';

    const ru = `А-а-Б-б-В-в-Ґ-ґ-Г-г-Д-д-Е-е-Ё-ё-Є-є-Ж-ж-З-з-И-и-/-/-/
      -/-Й-й-К-к-Л-л-М-м-Н-н-О-о-П-п-Р-р-С-с-Т-т-У-у-Ф-ф-Х-х
      -Ц-ц-Ч-ч-Ш-ш-Щ-щ-Ъ-ъ-Ы-ы-Ь-ь-Э-э-Ю-ю-Я-я`.split('-');
    const en = `A-a-B-b-V-v-G-g-G-g-D-d-E-e-E-e-E-e-ZH-zh-Z-z-I-i-I-i
      -I-i-J-j-K-k-L-l-M-m-N-n-O-o-P-p-R-r-S-s-T-t-U-u-F-f-H
      -h-TS-ts-CH-ch-SH-sh-SCH-sch-'-'-Y-y-'-'-E-e-YU-yu
      -YA-ya`.split('-');
    let result = '';

    for (let index = 0; index < name.length; index++) {
      const latterOfNameFromIndex = name.charAt(index);
      const lattersIndexOfRuABC = ru.indexOf(latterOfNameFromIndex);

      if (lattersIndexOfRuABC >= 0) {
        result += en[lattersIndexOfRuABC];
      } else {
        result += name[index];
      }
    }

    return result.split(' ').join('-').toLocaleLowerCase();
  } catch (e) {
    return '';
  }
}
