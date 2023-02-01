import { JwtService } from "@nestjs/jwt"
import { Test } from "@nestjs/testing"
import { getRepositoryToken } from "@nestjs/typeorm"
import { CartsRepository } from "src/cart/carts.respository"
import { Cart } from "src/cart/entities/cart.entity"
import { CreateUserDto } from "src/users/dto/create-user.dto"
import { User } from "src/users/entities/user.entity"
import { UsersService } from "src/users/users.service"
import { ClientsRepository } from "../clients.respository"
import { ClientsService } from "../clients.service"
import { Client } from "../entities/client.entity"




describe("client service", ()=>{

    let clientService : ClientsService
    let repository : ClientsRepository
    let cartRepository : CartsRepository
    let usersService: UsersService

    const createUserDto:CreateUserDto = {
        email: "email@email.com",
        password:"1234"
    }

    const type :string= "client"
    const user :User ={
        email:"email@emay.com",
        id:'1234',
        password:"1234",
targetId:"12",
targetType:"client"
    }

    const client : Client ={

        cart: new Cart(),
        id:"12",
        orders: []
    
    }

    const mockClientRepository = {
        create : jest.fn().mockImplementation(client => client)
    ,
    save:jest.fn().mockReturnValue(client),
    
        
    }
    const mockCartRepository = {
        create : jest.fn().mockImplementation()
        ,
        save:jest.fn().mockImplementation(),
        

    }

    const mockCreateClient = jest.fn().mockReturnValue(client)
    const mockUserService = {
        findOneByEmail:  jest.fn().mockImplementation(),
        create : jest.fn().mockReturnValue(user),
   

     }
    beforeAll(async()=>{
        const module = await Test.createTestingModule({
            providers: [ClientsService, JwtService,{
                provide: getRepositoryToken(ClientsRepository),
                useValue: mockClientRepository
            },
        {provide: getRepositoryToken(CartsRepository),
        
            useValue: mockCartRepository
        },
        {
            provide: UsersService,
            useValue: mockUserService
        }
        ],
            
        
        }).compile()
        clientService =  module.get<ClientsService>(ClientsService)
        repository = module.get<ClientsRepository>(ClientsRepository)
        usersService = module.get<UsersService>(UsersService)
    })
    




    it("should call service ",()=>{
        expect(clientService).toBeDefined()
        expect(repository).toBeDefined()
        expect(usersService).toBeDefined()

        
    })


    it("should return user ",async ()=>{

        const expected = await clientService.signUp(createUserDto,type)

        console.log(expected)
        expect(expected).toEqual(user)


    })



})