import Message from '../MessageModel/Message';
abstract class User {
  fName: string;
  lName: string;
  email: string;
  username: string;
  pass: string;
  DOB: Date;
  mobile: string;
  userType: string;
  inbox: Message[] = [];
  sent: Message[] = [];


  constructor(fName: string, lName: string, email: string, username: string, pass: string, mobile: string, userType: string, DOB: Date) {
    this.fName = fName;
    this.lName = lName;
    this.email = email;
    this.username = username;
    this.pass = pass;
    this.DOB = DOB;
    this.mobile = mobile;
    this.userType = userType;

  }


  login(username: string, pass: string): boolean {
    if (this.username === username && this.pass === pass) { return true }
    else return false;
  }
  abstract signup(fName: string, lName: string, email: string, username: string, pass: string, mobile: string, userType: string, DOB: Date): void

  editProfile(fName: string, lName: string, email: string, username: string, pass: string, mobile: string, userType: string, DOB: Date): void {
    this.fName = fName;
    this.lName = lName;
    this.email = email;
    this.username = username;
    this.pass = pass;
    this.DOB = DOB;
    this.mobile = mobile;
    this.userType = userType;

  }
  abstract deleteProfile(): void
  sendMessage(msg: Message, user: User): void {
    this.sent.concat(msg)
    user.receiveMessage(msg)
  }
  receiveMessage(msg: Message): void {
    this.inbox.concat(msg)
  }
  public getInbox(): Message[] {
    return this.inbox;
  }
  public setInbox(inbox: Message[]): void {
    this.inbox = inbox;
  }
}

export default User;

