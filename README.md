# Разработка программы  разграничения полномочий 

![](https://habrastorage.org/webt/ru/ds/z1/rudsz1ejm9bhyxigaszc51pe7uw.png)

Разработка программы  разграничения полномочий пользователей на основе парольной аутентификации

Содержание задания
1.	Программа должна обеспечивать работу в двух режимах: администратора (пользователя с фиксированным именем ADMIN) и обычного пользователя.
2.	В режиме администратора программа должна поддерживать следующие функции (при правильном вводе пароля):
•	смена пароля администратора (при правильном вводе старого пароля);
•	просмотр списка имен зарегистрированных пользователей и установленных для них параметров (блокировка учетной записи, включение ограничений на выбираемые пароли) – всего списка целиком в одном окне или по одному элементу списка с возможностью перемещения к его началу или концу;
•	добавление уникального имени нового пользователя к списку с пустым паролем (строкой нулевой длины);
•	блокирование возможности работы пользователя с заданным именем;
•	включение или отключение ограничений на выбираемые пользователем пароли (в соответствии с индивидуальным заданием, определяемым номером варианта);
•	завершение работы с программой.
3.	В режиме обычного пользователя программа должна поддерживать только функции смены пароля пользователя (при правильном вводе старого пароля) и завершения работы, а все остальные функции должны быть заблокированы.
4.	После своего запуска программа должна запрашивать у пользователя в специальном окне входа ввод его имени и пароля. При вводе пароля его символы всегда должны на экране заменяться символом ‘*’.
5.	При отсутствии введенного в окне входа имени пользователя в списке зарегистрированных администратором пользователей программа должна выдавать соответствующее сообщение и предоставлять пользователю возможность повторного ввода имени или завершения работы с программой.
6.	При неправильном вводе пароля программа должна выдавать соответствующее сообщение и предоставлять пользователю возможность повторного ввода. При трехкратном вводе неверного пароля работа программы должна завершаться.
7.	При первоначальном вводе пароля (обязательном при первом входе администратора или пользователя с зарегистрированным ранее администратором именем) и при дальнейшей замене пароля программа должна просить пользователя подтвердить введенный пароль путем его повторного ввода.
8.	Если выбранный пользователем пароль не соответствует требуемым ограничениям (при установке соответствующего параметра учетной записи пользователя), то программа должна выдавать соответствующее сообщение и предоставлять пользователю возможность ввода другого пароля, завершения работы с программой (при первом входе данного пользователя) или отказа от смены пароля.
9.	Информация о зарегистрированных пользователях, их паролях, отсутствии блокировки их работы с программой, а также включении или отключении ограничений на выбираемые пароли должна сохраняться в специальном файле. При первом запуске программы этот файл должен создаваться автоматически и содержать информацию только об администраторе, имеющем пустой пароль.
10.	Интерфейс с программой должен быть организован на основе меню, обязательной частью которого должно являться подменю «Справка» с командой «О программе». При выборе этой команды должна выдаваться информация об авторе программы и выданном индивидуальном задании. Интерфейс пользователя программы может также включать панель управления с дублирующими команды меню графическими кнопками и строку состояния.
11.	Для реализации указанных в пунктах 2-3 функций в программе должны использоваться специальные диалоговые формы, позволяющие пользователю (администратору) вводить необходимую информацию.

Индивидуальные варианты заданий (ограничения на выбираемые  пароли)
Наличие латинских букв и символов кириллицы.

## Решение

1. Сгенерировать SSL сертификаты для использования https

OpenSSL – это криптографическая библиотека, которая является open source реализацией двух протоколов: Secure Sockets Layer (SSL) и Transport Layer Security (TLS). Данная библиотека имеет инструменты, предназначенные для генерации приватных ключей RSA и Certificate Signing Requests (CSR-запросов), управления сертификатами и выполнения шифрования/дешифрования. Библиотека OpenSSL написана на C, однако существуют оболочки для широкого спектра языков программирования.

Для генерации секретного ключа (key) и запроса на сертификат (CSR) используется утилита OpenSSL.

```
$ openssl req -newkey rsa:2048 -nodes -keyout simple-authorize-service.private.key -x509 -days 365 -out simple-authorize-service.certificate.crt

Generating a 2048 bit RSA private key
......................................................+++
..........................+++
writing new private key to 'simple-authorize-service.private.key'
-----
You are about to be asked to enter information that will be incorporated
into your certificate request.
What you are about to enter is what is called a Distinguished Name or a DN.
There are quite a few fields but you can leave some blank
For some fields there will be a default value,
If you enter '.', the field will be left blank.
-----

```

