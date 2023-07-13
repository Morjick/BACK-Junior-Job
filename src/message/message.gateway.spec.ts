import * as io from 'socket.io-client';
import { ConsoleLogger, INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { IoAdapter } from '@nestjs/platform-socket.io';

describe('Chat connection', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    })
      .setLogger(new ConsoleLogger())
      .compile();

    app = moduleFixture.createNestApplication();
    app.useWebSocketAdapter(new IoAdapter(app.getHttpServer()));
    await app.init();
  });

  it('I can connect to the socket server', (done) => {
    const address = app.getHttpServer().listen().address();
    const baseAddress = `http://[${address.address}]:${address.port}`;
    const socket1 = io.connect(baseAddress);
    const socket2 = io.connect(baseAddress);

    socket1.on('connect', () => {
      socket1.emit('init', {
        authorization:
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6ImFhYSIsImxhc3RuYW1lIjoiYWFhYSIsInJvbGUiOiJST09UIiwiaWF0IjoxNjg4NTU3NDU5LCJleHAiOjE2ODk4NTM0NTl9.senUsZmM421lY-1LXk6rkiBsGcdiR3I0Q0Sn3jTvXhA',
      });
    });

    socket2.on('connect', () => {
      socket2.emit('init', {
        authorization:
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwibmFtZSI6ImFhYSIsImxhc3RuYW1lIjoiYWFhYSIsInJvbGUiOiJST09UIiwiaWF0IjoxNjg4OTMzMDkzLCJleHAiOjE2OTAyMjkwOTN9.KEf1R0x-ueG-qALnLiKOF8zHzaQOsW8MUuUlJ0Qag5U',
      });
    });

    socket1.on('error', (error) => {
      console.error(error.message);
    });

    socket1.on('init', () => {
      socket1.emit('message', { userId: 2, body: 'Hello world!' });
    });

    socket2.on('message', (message) => {
      if (message.senderId === 1 && message.body === 'Hello world!') {
        pass();
      }
    });

    function pass() {
      socket1.disconnect();
      socket2.disconnect();
      done();
    }
  }, 20000);
});
