/*
 * Copyright (C) 2017, 2021-2024 Team FESTIVAL
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import ParadiseService from '@/ParadiseService';
import { Log } from '@/utils';
import bodyParser from 'body-parser';
import bodyParserXml from 'body-parser-xml';
import express, { type Express } from 'express';
import * as http from 'http';
import httpStatus from 'http-status';
import type { AddressInfo } from 'net';
import Routes, { ServiceVersions } from './routes';
import type BaseWebService from './routes/BaseWebService';

export default class WebServiceHost {
  readonly port: number;

  readonly expressApp: Express;
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

    this.expressApp.use((req, res, next) => {
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

</HTML>`);
    });
  }

  async start(): Promise<void> {
    Log.info('Starting Web Service server...');

    return new Promise((resolve, reject) => {
      this.listener = this.expressApp.listen(
        this.port,
        ParadiseService.Instance.ServiceSettings.Hostname ?? '0.0.0.0',
        () => {
          for (const services of Object.values(ServiceVersions)) {
            for (const service of Object.values(services) as (typeof BaseWebService)[]) {
              Log.debug(`Initializing ${service.ServiceName} (${service.ServiceVersion})...`);
            }
          }

          const address: AddressInfo = this.listener?.address() as AddressInfo;
          Log.info(`Web Service server listening on ${address.address}:${address.port}.`);

          resolve();
        },
      );
    });
  }

  stop(): void {
    this.listener?.close();
    this.listener = undefined;
  }
}
