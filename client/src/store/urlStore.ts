

export default class UrlStore{

    //private static urlEmim: string = 'http://localhost:5006/'; https://telemedicina.emim.ro:444/api/medici
    //private static urlEmim: string = 'http://82.77.27.57:56002/';
    private static urlEmim: string = 'https://telemedicina.emim.ro:444/';
    static urlEmimChat: string = this.urlEmim + 'chat';
    static urlEmimApi: string = this.urlEmim + 'api';
    static urlVideoChat: string = 'https://video-chat-luci.herokuapp.com/';

}