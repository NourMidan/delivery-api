import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { AppModule } from "../app.module";
import { MenuService } from "../menu/menu.service";

export class IntegrationTestManager { 
    private app : INestApplication
    public httpServer : any;
    
    async beforeAll(): Promise<void>{

        const moduleRef = await Test.createTestingModule({
            imports: [AppModule]
        }).compile()

        this.app = moduleRef.createNestApplication()
        await this.app.init()
        this.httpServer = this.app.getHttpServer()
        const menuService = this.app.get<MenuService>(MenuService)
    }


}