/* eslint-disable camelcase */
import ParadiseServiceSettings from '@/ParadiseServiceSettings';
import { SOAPResponse } from '@/utils';
import { Router } from 'express';
import httpStatus from 'http-status';
import * as ServicesV1_0_2 from './v102';
import * as ServicesV2_0 from './v2';

export const ServiceVersions = {
  '1.0.2': ServicesV1_0_2,
  '2.0': ServicesV2_0,
};

const router = Router();

router.use(
  new RegExp(`^/(.+)/${ParadiseServiceSettings.WebServicePrefix}(.+)${ParadiseServiceSettings.WebServiceSuffix}$`),
  async (req, res, next) => {
    const serviceVersion = ServiceVersions[req.params[0]];
    if (!serviceVersion) return res.status(httpStatus.BAD_REQUEST).send('');

    const service = serviceVersion[req.params[1]];
    if (!service) return res.status(httpStatus.BAD_REQUEST).send('');

    if (req.headers['content-type'] !== 'text/xml; charset=utf-8') {
      res.statusMessage = `Cannot process the message because the content type '${req.headers['content-type']}' was not the expected type 'text/xml; charset=utf-8'.`;
      return res.status(httpStatus.UNSUPPORTED_MEDIA_TYPE).send();
    }
    if (!req.body || !Object.keys(req.body).length) return res.status(httpStatus.BAD_REQUEST).send('');

    if (!req.headers.soapaction) return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(SOAPResponse.createFault());
    const soapAction = new URL((req.headers.soapaction as string).replace(/"/g, '')).pathname.substring(1).split('/');

    if (service.ServiceInterface !== soapAction[0])
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(SOAPResponse.createFault(req.headers.soapaction));

    const method = soapAction[1];
    const body = req.body['s:Envelope']['s:Body'][0];
    const bodyMethod = Object.keys(body)[0];
    const bodyData = body[bodyMethod][0].data[0];

    if (bodyMethod !== method || !service[method])
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(SOAPResponse.createFault(req.headers.soapaction));

    const inputBytes = [...Buffer.from(bodyData, 'base64')];

    try {
      const bytes = await service[method](inputBytes, []);

      res.setHeader('Content-Type', 'text/xml; charset=utf-8');
      res.setHeader('Server', 'Microsoft-HTTPAPI/2.0');

      if (!bytes) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(SOAPResponse.createFault(req.headers.soapaction));
      }

      return res.status(httpStatus.OK).send(SOAPResponse.create(bodyMethod, bytes ?? []));
    } catch (error: any) {
      console.error(error);
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error.message);
    }
  },
);

export default router;
