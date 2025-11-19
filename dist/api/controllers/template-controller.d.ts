import { Request, Response, NextFunction } from 'express';
export declare class TemplateController {
    private templateService;
    constructor();
    list: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    get: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=template-controller.d.ts.map