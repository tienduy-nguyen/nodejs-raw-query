import express from 'express';
import { injectable } from 'tsyringe';
import { Response, NextFunction } from 'express';
import { BadRequestException, NotFoundException } from 'src/common/exceptions';
import { LoginUserDto, RegisterUserDto } from '../auth/dto';
import { AuthService } from './services/auth.service';
import { UserService } from '../user/user.service';
import { JwtService } from './services/jwt.service';
import { PayloadToken, RequestWithUser } from 'src/common/types';
import { SESSION_AUTH } from 'src/common/config/session.config';
import { User } from '../user/user.model';
import handler from 'express-async-handler';
import { authMiddleware } from 'src/common/middlewares/auth.middleware';
import { UserSettingsService } from '../user-settings/user-settings.service';
@injectable()
export class AuthController {
  public path = '/auth';
  public router = express.Router();

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private jwtService: JwtService,
    private userSettingsService: UserSettingsService,
  ) {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, authMiddleware(), handler(this.me));
    this.router.post(`${this.path}/login`, handler(this.login));
    this.router.post(`${this.path}/register`, handler(this.register));
    this.router.delete(`${this.path}`, authMiddleware(), handler(this.logout));
  }

  /* Private method for controller */

  private me = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { userId } = req.user;
      const user = await this.userService.getUserById(userId);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      res.json(user);
    } catch (error) {
      next(error);
    }
  };
  private login = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const data: LoginUserDto = req.body;
      const user = await this.authService.loginUser(data);
      // if user null --> auto throw error (catch error already in authService)
      const { token } = this.updateSession(user, req);
      res.json({ token });
    } catch (error) {
      next(error);
    }
  };

  private register = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const data: RegisterUserDto = req.body;
      const user = await this.authService.registerUser(data);
      // Create user settings default
      await this.userSettingsService.createUserSettings(user.id);

      // Update auth token in session
      const { token } = this.updateSession(user, req);
      res.json({ token });
    } catch (error) {
      next(error);
    }
  };

  private logout = async (req: RequestWithUser, res: Response) => {
    try {
      req.res?.clearCookie(SESSION_AUTH);
      await req.session!.destroy();
      res.json({ logout: true });
    } catch (error) {
      console.error(error);
      res.json({ logout: false });
    }
  };

  /* Helper methods */
  private updateSession(user: User, req: RequestWithUser): { token: string } {
    if (!user) {
      throw new BadRequestException('User not authenticated');
    }
    const payload: PayloadToken = {
      userId: user.id,
    };
    const { token } = this.jwtService.sign(payload);

    // Update token in session
    req.session.accessToken = token;
    return { token };
  }
}
