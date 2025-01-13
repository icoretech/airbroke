// prisma/seed.ts

import { PrismaClient } from '@prisma/client';
import crypto from 'node:crypto';

const prisma = new PrismaClient();

async function main() {
  const numberOfProjects = 3;
  const numberOfNotices = 5;
  const createdProjects = [];

  for (let i = 1; i <= numberOfProjects; i++) {
    const projectName = `Project ${i}`;
    // const projectKey = await generateUniqueProjectKey()

    const project = await prisma.project.upsert({
      where: { name: projectName },
      update: {},
      create: {
        name: projectName,
      },
    });

    createdProjects.push(project);

    for (let j = 1; j <= numberOfNotices; j++) {
      const noticeKind = `ActionController::RoutingError${j}`;

      const notice = await prisma.notice.upsert({
        where: { project_id_env_kind: { kind: noticeKind, project_id: project.id, env: 'development' } },
        update: {},
        create: {
          project_id: project.id,
          kind: noticeKind,
        },
      });

      const message = "Identifier 'ab_functions' has already been declared";
      const messageHash = crypto.createHash('md5').update(message, 'utf8').digest('hex');

      await prisma.occurrence.upsert({
        where: {
          notice_id_message_hash: {
            notice_id: notice.id,
            message_hash: messageHash,
          },
        },
        create: {
          notice_id: notice.id,
          message: message,
          message_hash: messageHash,
          backtrace: [
            {
              file: '/usr/local/lib/ruby/3.1.0/uri/rfc3986_parser.rb',
              line: 67,
              function: 'split',
            },
            {
              file: '/usr/local/lib/ruby/3.1.0/uri/rfc3986_parser.rb',
              line: 72,
              function: 'parse',
            },
            {
              file: '/usr/local/lib/ruby/3.1.0/uri/common.rb',
              line: 188,
              function: 'parse',
            },
            {
              file: '/usr/local/lib/ruby/3.1.0/uri/common.rb',
              line: 692,
              function: 'URI',
            },
            {
              file: '/PROJECT_ROOT/app/controllers/users/registrations_controller.rb',
              line: 498,
              function: 'print_log',
            },
            {
              file: '/PROJECT_ROOT/app/controllers/users/registrations_controller.rb',
              line: 17,
              function: 'new',
            },
            {
              file: '/GEM_ROOT/gems/actionpack-7.0.3.1/lib/action_controller/metal/basic_implicit_render.rb',
              line: 6,
              function: 'send_action',
            },
          ],
          context: {
            url: 'https://my.domain.com/#/splash?u=xDcjxZYdxUZUdWDSgqps&page=369&nextPath=%2Fbooks%2F11781',
            history: [
              {
                to: '/',
                date: '2022-10-09T20:02:22.123Z',
                from: '/',
                type: 'location',
              },
            ],
            language: 'JavaScript',
            notifier: {
              url: 'https://github.com/airbrake/airbrake-js/tree/master/packages/browser',
              name: 'airbrake-js/browser',
              version: '2.1.7',
            },
            severity: 'error',
            userAgent:
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36',
            windowError: true,
            rootDirectory: 'https://my.domain.com',
          },
          environment: {
            app_type: 'web',
            app_flavour: 'default',
            app_version: '7.4.2',
            client_lang: 'it-IT',
          },
          session: {
            session_id: 'd76a962bdcb44d80c6104874f5401e2b',
            _csrf_token: 'Z_Bi8QnLsiQhlcJ10v1STgsTQJGHguwyMbe-Wc7OzQ8',
          },
          params: {
            page: '235',
            book_id: 16899,
            content: null,
            user_id: 3206792,
            app_type: 'desktop',
            platform: 'pc',
            device_id: 3694746,
            user_role: 'student',
            created_at: null,
            updated_at: null,
            user_agent:
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) MyApp/7.4.1 Chrome/80.0.3987.165 Electron/8.2.5 Safari/537.36',
            app_version: '7.4.1',
            resource_id: 16643461180004,
            app_timestamp: 1664347553,
            calculated_at: null,
            net_available: false,
            resource_type_id: 11,
          },
        },
        update: {},
      });
      // console.log({ project: project.name, notice: notice.kind })
    }
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
