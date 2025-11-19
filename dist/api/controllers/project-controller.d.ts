import { Request, Response, NextFunction } from 'express';
export declare class ProjectController {
    private projectService;
    constructor();
    create: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    list: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    get: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    generate: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    download: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=project-controller.d.ts.map