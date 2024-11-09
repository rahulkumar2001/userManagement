import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { UsersService } from './user.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';

describe('UsersService', () => {
  let service: UsersService;
  let usersRepository: Repository<User>;

  const mockUserRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    usersRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findOne', () => {
    it('should return a user if found', async () => {
      const mobile = '1234567890';
      const user = { id: 1, mobile, name: 'Test User', password: 'hashedpassword' };

      mockUserRepository.findOne.mockResolvedValue(user);

      expect(await service.findOne(mobile)).toEqual(user);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({ where: { mobile } });
    });

    it('should return undefined if user not found', async () => {
      const mobile = 'nonexistent';
      mockUserRepository.findOne.mockResolvedValue(undefined);

      expect(await service.findOne(mobile)).toBeUndefined();
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({ where: { mobile } });
    });
  });

  describe('create', () => {
    it('should throw an error if the mobile number already exists', async () => {
      const mobile = '1234567890';
      const name = 'Test User';
      const password = 'password';
      const existingUser = { id: 1, mobile, name, password: 'hashedpassword' };

      mockUserRepository.findOne.mockResolvedValue(existingUser);

      await expect(service.create(mobile, name, password)).rejects.toThrow(
        new BadRequestException('this mobile number already exists.')
      );
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({ where: { mobile } });
    });

    it('should create a new user with hashed password if mobile number does not exist', async () => {
      const mobile = '1234567890';
      const name = 'New User';
      const password = 'password';
      const hashedPassword = 'hashedpassword';
      const newUser = { mobile, name, password: hashedPassword };

      mockUserRepository.findOne.mockResolvedValue(undefined);
      mockUserRepository.create.mockReturnValue(newUser);
      mockUserRepository.save.mockResolvedValue(newUser);
      jest.spyOn(bcrypt, 'hash').mockResolvedValue(hashedPassword);

      const result = await service.create(mobile, name, password);

      expect(result).toEqual(newUser);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({ where: { mobile } });
      expect(bcrypt.hash).toHaveBeenCalledWith(password, 10);
      expect(mockUserRepository.create).toHaveBeenCalledWith({
        mobile,
        name,
        password: hashedPassword,
      });
      expect(mockUserRepository.save).toHaveBeenCalledWith(newUser);
    });
  });

  describe('validateUser', () => {
    it('should return the user if password is valid', async () => {
      const mobile = '1234567890';
      const password = 'password';
      const user = { id: 1, mobile, name: 'Test User', password: 'hashedpassword' };

      mockUserRepository.findOne.mockResolvedValue(user);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

      const result = await service.validateUser(mobile, password);

      expect(result).toEqual(user);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({ where: { mobile } });
      expect(bcrypt.compare).toHaveBeenCalledWith(password, user.password);
    });

    it('should return null if password is invalid', async () => {
      const mobile = '1234567890';
      const password = 'invalidpassword';
      const user = { id: 1, mobile, name: 'Test User', password: 'hashedpassword' };

      mockUserRepository.findOne.mockResolvedValue(user);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

      const result = await service.validateUser(mobile, password);

      expect(result).toBeNull();
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({ where: { mobile } });
      expect(bcrypt.compare).toHaveBeenCalledWith(password, user.password);
    });

    it('should return null if user does not exist', async () => {
      const mobile = 'nonexistent';
      const password = 'password';

      mockUserRepository.findOne.mockResolvedValue(undefined);

      const result = await service.validateUser(mobile, password);

      expect(result).toBeNull();
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({ where: { mobile } });
    });
  });
});
