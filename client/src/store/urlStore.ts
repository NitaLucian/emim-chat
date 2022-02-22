

export default class UrlStore{

    //private static urlEmimBase: string = 'http://localhost:5006/'; 
    private static urlEmimBase: string = 'https://telemedicina.emim.ro:444/';

    static urlEmimChat: string = this.urlEmimBase + 'chat'; //aici vorbesc prin SignalR

    static urlEmimApi: string = this.urlEmimBase + 'api'; //aici fac apelnpm starturi obisnuite din baza de date EMIM

    static urlVideoChat: string =  'https://video-chat-luci.herokuapp.com/'; //'http://localhost:5000/';//

}