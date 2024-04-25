import ParadiseService from '@/ParadiseService';
import { Log } from '@/utils';
import bodyParser from 'body-parser';
import bodyParserXml from 'body-parser-xml';
import express, { type Express } from 'express';
import * as http from 'http';
import httpStatus from 'http-status';
import { AddressInfo } from 'net';
import Routes, { ServiceVersions } from './routes';

export default class WebServiceHost {
  public readonly port: number;

  public readonly expressApp: Express;
  private listener?: http.Server;

  constructor(port: number = 8080) {
    this.port = port;

    this.expressApp = express();
    this.expressApp.disable('x-powered-by');
    this.expressApp.disable('etag');
    this.expressApp.set('json spaces', 2);

    // if (process.env.NODE_ENV !== 'production') {
    //   this.expressApp.use(morgan(`[${chalk.blue('INFO')}] [WebServiceHost] [:date[iso]] :remote-addr ":method :url HTTP/:http-version" :status (:req[Content-Length]/:res[content-length] bytes)`));
    // }

    bodyParserXml(bodyParser);

    this.expressApp.use(express.urlencoded({ extended: true }));
    this.expressApp.use(bodyParser.xml());

    this.expressApp.use((req, res, next) => {
      res.set('X-Powered-By', 'Hamsterwheel/1.0');
      res.set('Server', 'Microsoft-HTTPAPI/2.0');

      return next();
    });

    this.expressApp.use(Routes);

    this.expressApp.use((req, res, next) =>
      res.status(httpStatus.NOT_FOUND)
        .send(`<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN""http://www.w3.org/TR/html4/strict.dtd">
<HTML>

<HEAD>
\t<TITLE>Not Found</TITLE>
\t<META HTTP-EQUIV="Content-Type" Content="text/html; charset=us-ascii">
</HEAD>

<BODY>
\t<h2>Not Found</h2>
\t<hr>
\t<p>HTTP Error 404. The requested resource is not found.</p>
</BODY>

</HTML>`),
    );
  }

  public async start(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.listener = this.expressApp.listen(
        this.port,
        ParadiseService.Instance.ServiceSettings.Hostname ?? '0.0.0.0',
        () => {
          for (const services of Object.values(ServiceVersions)) {
            for (const service of Object.values(services)) {
              Log.debug(`Initializing ${service.ServiceName} (${service.ServiceVersion})...`);
            }
          }

          const address: AddressInfo = this.listener?.address() as AddressInfo;
          Log.info(`HTTP server listening on ${address.address}:${address.port}.`);

          resolve();
        },
      );
    });
  }

  public stop(): void {
    this.listener?.close();
    this.listener = undefined;
  }
}
