import { Injectable, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ThrottlerGuard } from '@nestjs/throttler';
import { IncomingMessage, ServerResponse } from 'node:http';

@Injectable()
export class GqlThrottlerGuard extends ThrottlerGuard {
  getRequestResponse(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context).getContext<GqlContext>();
    return { req: ctx.req, res: ctx?.res ?? noopRes };
  };
};

const noopRes = { header: () => undefined } as unknown as ServerResponse;

interface GqlContext {
  req: IncomingMessage;
  res?: ServerResponse;
};