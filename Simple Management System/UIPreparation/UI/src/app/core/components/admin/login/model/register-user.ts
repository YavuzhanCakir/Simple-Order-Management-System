export class RegisterUser {
    fullName: string;         // Kullanıcının adı
    email: string;            // E-posta adresi
    password: string;         // Şifre
    birthDate: string;        // Doğum tarihi
    mobilePhones: string;     // Telefon numarası
    gender: string;           // Cinsiyet
    lang: string;             // Dil tercihleri
    address: string;          // Adres

    constructor() {
        this.lang = 'en';     // Varsayılan dil, ihtiyaç varsa değiştirilebilir
    }       
}
