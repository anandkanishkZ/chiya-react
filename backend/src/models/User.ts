import {
  Model,
  DataTypes,
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
  ForeignKey,
} from 'sequelize';
import bcrypt from 'bcryptjs';
import sequelize from '../config/database';
import { UserRole, IUserProfile } from '../types';

export interface UserAttributes extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  id: CreationOptional<string>;
  username: string;
  email: string;
  password: string;
  role: UserRole;
  // restaurantId?: ForeignKey<string>; // Temporarily disabled
  profile: IUserProfile;
  isActive: CreationOptional<boolean>;
  lastLogin?: Date;
  createdAt: CreationOptional<Date>;
  updatedAt: CreationOptional<Date>;
  deletedAt?: Date;
}

class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> implements UserAttributes {
  declare id: CreationOptional<string>;
  declare username: string;
  declare email: string;
  declare password: string;
  declare role: UserRole;
  // declare restaurantId?: ForeignKey<string>; // Temporarily disabled
  declare profile: IUserProfile;
  declare isActive: CreationOptional<boolean>;
  declare lastLogin?: Date;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare deletedAt?: Date;

  // Instance methods
  async checkPassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }

  toJSON() {
    const user = { ...this.get() } as any;
    delete user.password;
    delete user.deletedAt;
    return user;
  }

  // Static methods
  static async hashPassword(password: string): Promise<string> {
    const rounds = parseInt(process.env.BCRYPT_ROUNDS || '12');
    return bcrypt.hash(password, rounds);
  }
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      validate: {
        len: [3, 50],
        notEmpty: true,
      },
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
        notEmpty: true,
      },
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        len: [6, 255],
        notEmpty: true,
      },
    },
    role: {
      type: DataTypes.ENUM(...Object.values(UserRole)),
      allowNull: false,
      defaultValue: UserRole.STAFF,
    },
    // restaurantId: {
    //   type: DataTypes.UUID,
    //   allowNull: true,
    //   references: {
    //     model: 'restaurants',
    //     key: 'id',
    //   },
    // }, // Temporarily disabled
    profile: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: {
        firstName: '',
        lastName: '',
        phone: '',
        position: '',
        permissions: [],
      },
      validate: {
        isValidProfile(value: IUserProfile) {
          if (!value.firstName || !value.lastName) {
            throw new Error('Profile must include firstName and lastName');
          }
        },
      },
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    lastLogin: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'users',
    modelName: 'User',
    paranoid: true,
    indexes: [
      {
        fields: ['email'],
        unique: true,
      },
      {
        fields: ['username'],
        unique: true,
      },
      {
        fields: ['role'],
      },
      // {
      //   fields: ['restaurantId'],
      // }, // Temporarily disabled
    ],
    hooks: {
      beforeCreate: async (user: User) => {
        if (user.password) {
          user.password = await User.hashPassword(user.password);
        }
      },
      beforeUpdate: async (user: User) => {
        if (user.changed('password') && user.password) {
          user.password = await User.hashPassword(user.password);
        }
      },
    },
  }
);

export default User;
