import ParadiseServiceSettings from '@/ParadiseServiceSettings';
import { SOAPResponse } from '@/utils';
import { Router } from 'express';
import httpStatus from 'http-status';
import ApplicationWebService from './ApplicationWebService';
import AuthenticationWebService from './AuthenticationWebService';
import ClanWebService from './ClanWebService';
import ModerationWebService from './ModerationWebService';
import ParadiseWebService from './ParadiseWebService';
import PrivateMessageWebService from './PrivateMessageWebService';
import RelationshipWebService from './RelationshipWebService';
import ShopWebService from './ShopWebService';
import UserWebService from './UserWebService';

export const Services = {
  ApplicationWebService,
  AuthenticationWebService,
  ClanWebService,
  ModerationWebService,
  PrivateMessageWebService,
  RelationshipWebService,
  ShopWebService,
  UserWebService,
  ParadiseWebService,
};

const router = Router();

router.use(new RegExp(`^/${ParadiseServiceSettings.WebServicePrefix}(.+)${ParadiseServiceSettings.WebServiceSuffix}`), async (req, res, next) => {
  const service = Services[req.params[0]];
  if (!service) return res.status(httpStatus.BAD_REQUEST).send('');

  if (!req.body || !Object.keys(req.body).length) return res.status(httpStatus.BAD_REQUEST).send('');

  if (!req.headers.soapaction) return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(SOAPResponse.createFault());
  const method = (req.headers.soapaction as string).split('/').slice(-1)[0].replace(/"/g, '');

  const body = req.body['s:Envelope']['s:Body'][0];
  const bodyMethod = Object.keys(body)[0];
  const bodyData = body[bodyMethod][0].data[0];

  if (bodyMethod !== method || !service[method]) return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(SOAPResponse.createFault(req.headers.soapaction));

  const inputBytes = [...Buffer.from(bodyData, 'base64')];

  try {
    const bytes = await service[method](inputBytes, []);

    res.setHeader('Content-Type', 'text/xml; charset=utf-8');
    res.setHeader('Server', 'Microsoft-HTTPAPI/2.0');

    return res.status(httpStatus.OK).send(SOAPResponse.create(bodyMethod, bytes ?? []));
  } catch (error: any) {
    console.error(error);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error.message);
  }
});

export default router;
