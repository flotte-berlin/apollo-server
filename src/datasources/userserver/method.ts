/* eslint no-unused-vars: 0 */
export enum Method {
    Null = 0x00,
    Error = 0x0F_0F_0F_0F,
    Info = 0x49_4e_46_4f,
    ValidateToken = 0x56_41_4c_49,
    GetRoles = 0x52_4f_4c_45,
    GetRolePermissions = 0x50_45_52_4d,
    CreateRole = 0x43_52_4f_4c,
    CreatePermissions = 0x43_50_45_52,
    GetUserID = 0x55534552
}
