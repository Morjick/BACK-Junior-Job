import getTransplit from './getTransplit';

export async function validationPassword(password: string, name?: string) {
  if (!password.split(' ').join('').length)
    return {
      message: 'Не используйте, пожалуйста, пробела',
      ok: false,
      warning: false,
    };

  if (
    name &&
    (password == name ||
      name.toLocaleLowerCase() ==
        (await getTransplit(password)).toLocaleLowerCase())
  ) {
    return {
      message: 'Не используйте в качестве пароля своё имя, даже в транслите',
      ok: false,
      warning: false,
    };
  }

  if (
    password.includes('1234') ||
    password.includes('qwer') ||
    password.includes('zxcv') ||
    password.includes('123456789')
  )
    return {
      message:
        'Старайтесь избегать в пароле сочитания цифр от 1 до 9 и буквенно-строчные сочитания (например, qwerty). Так злоумышленник сможет легко Вас взломать',
      ok: false,
      warning: false,
    };

  if (
    password.includes('password') ||
    password.includes('0000') ||
    password.includes('1111') ||
    password.includes('2222')
  )
    return {
      message: 'Пароль слишком простой',
      ok: false,
      warning: false,
    };

  if (password.includes('00'))
    return {
      message: 'Не советуется использовать год рождения',
      ok: true,
      warning: true,
    };

  return {
    message: 'Пароль отлично подошёл',
    ok: true,
    warning: false,
  };
}
