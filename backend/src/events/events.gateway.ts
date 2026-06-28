import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

// Mở CORS để Frontend ở port 5173 gọi sang không bị chặn
@WebSocketGateway({
  cors: {
    origin: '*', // Hoặc process.env.FRONTEND_URL
  },
})
export class EventsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  afterInit(server: Server) {
    console.log('Socket.IO Gateway đã khởi tạo!');
  }

  handleConnection(client: Socket) {
    console.log(`Client kết nối: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client ngắt kết nối: ${client.id}`);
  }

  // Hàm này để các file Service khác (Appointments, Invoices) gọi vào để phát sóng
  emitUpdate(eventName: string, payload: any) {
    this.server.emit(eventName, payload);
  }
}
