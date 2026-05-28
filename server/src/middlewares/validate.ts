import { z, type ZodType } from 'zod';
import { Request, Response, NextFunction } from 'express';

type Source = 'body' | 'query' | 'params';

export const validate =
  <T extends ZodType>(schema: T, source: Source) =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[source]);

    if (!result.success) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: z.flattenError(result.error),
      });
    }

    res.locals.validated = result.data;
    next();
  };
