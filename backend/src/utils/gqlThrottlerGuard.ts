import { Injectable, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ThrottlerGuard } from '@nestjs/throttler';
import { IncomingMessage, ServerResponse } from 'node:http';

@Injectable()
export class GqlThrottlerGuard extends ThrottlerGuard {
  getRequestResponse(context: ExecutionContext) : GqlContext {
    const { req, res } = GqlExecutionContext.create(context).getContext<GqlContext>();
    return { req, res };
  };
};

interface GqlContext {
  req: IncomingMessage;
  res: ServerResponse;
};