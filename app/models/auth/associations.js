import User from "./user.model";
import Role from "./role.model";
import UserRole from "./user-roles.model";

User.belongsTo(Role, {
    through: UserRole
})

Role.belongsTo(User, {
    through: UserRole
})
