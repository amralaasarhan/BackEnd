import Message from "./Message";

interface MessageDAO {
    addMessage(message: Message): Promise<void>;
    getMessage(filter: any): Promise<Message>;
    // getAllMessages(): Promise<Message[]>;
    // getAllMessagesFilter(filter: any): Promise<Message[]>;
    getSentMessages(sender: string):  Promise<Message[]>;
    getReceivedMessage(recepient: string) : Promise<Message[]>;
    deleteMessage(message: Message): void;
    updateMessage(subject: string, edit: any): Promise<void>;
}

export default MessageDAO; 