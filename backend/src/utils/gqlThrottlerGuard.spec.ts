import { ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { GqlThrottlerGuard } from './gqlThrottlerGuard';
import type { IncomingMessage, ServerResponse } from 'node:http';

describe('GqlThrottlerGuard', () => {
  let guard: GqlThrottlerGuard;
  let mockReq: IncomingMessage;
  let mockRes: ServerResponse;
  let mockExecutionContext: ExecutionContext;

  beforeEach(() => {
    guard = new GqlThrottlerGuard(
      {} as never,
      {} as never,
      {} as never,
    );
    mockReq = { ip: '127.0.0.1' } as unknown as IncomingMessage;
    mockRes = { header: vi.fn() } as unknown as ServerResponse;
    mockExecutionContext = {} as ExecutionContext;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const mockGqlContext = (ctx: Record<string, unknown>) => {
    return vi.spyOn(GqlExecutionContext, 'create').mockReturnValue({
      getContext: () => ctx,
    } as unknown as GqlExecutionContext);
  };

  it('returns req and res from the GraphQL context', () => {
    const createSpy = mockGqlContext({ req: mockReq, res: mockRes });

    const result = guard['getRequestResponse'](mockExecutionContext);

    expect(createSpy).toHaveBeenCalledWith(mockExecutionContext);
    expect(result.req).toBe(mockReq);
    expect(result.res).toBe(mockRes);
  });

  it('returns noopRes when res is undefined', () => {
    mockGqlContext({ req: mockReq, res: undefined });

    const result = guard['getRequestResponse'](mockExecutionContext);

    expect(result.req).toBe(mockReq);
    expect(result.res).not.toBeUndefined();
    expect(result.res).not.toBe(mockRes);
  });

  it('returns noopRes when res is null', () => {
    mockGqlContext({ req: mockReq, res: null });

    const result = guard['getRequestResponse'](mockExecutionContext);

    expect(result.req).toBe(mockReq);
    expect(result.res).not.toBeNull();
  });

  it('returns a noopRes with a callable header method when res is missing', () => {
    mockGqlContext({ req: mockReq });

    const result = guard['getRequestResponse'](mockExecutionContext);

    expect(typeof (result.res as unknown as { header: unknown }).header).toBe(
      'function',
    );
    expect(
      (result.res as unknown as { header: () => unknown }).header(),
    ).toBeUndefined();
  });
});
