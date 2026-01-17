package com.famoney.api.member.entity;

/**
 * Enum representing member roles in a ledger.
 *
 * Role hierarchy (highest to lowest permissions):
 * OWNER > ADMIN > MEMBER > VIEWER
 */
public enum MemberRole {
    /**
     * Full permissions including ledger deletion and role management.
     */
    OWNER,

    /**
     * Can manage expenses, invite members, and modify ledger settings.
     */
    ADMIN,

    /**
     * Can create, edit, and delete their own expenses.
     */
    MEMBER,

    /**
     * Read-only access to the ledger.
     */
    VIEWER;

    /**
     * Check if this role has at least the specified permission level.
     */
    public boolean hasAtLeast(MemberRole required) {
        return this.ordinal() <= required.ordinal();
    }

    /**
     * Check if this role can manage members (invite, remove, change roles).
     */
    public boolean canManageMembers() {
        return this == OWNER || this == ADMIN;
    }

    /**
     * Check if this role can modify ledger settings.
     */
    public boolean canModifyLedger() {
        return this == OWNER || this == ADMIN;
    }

    /**
     * Check if this role can delete the ledger.
     */
    public boolean canDeleteLedger() {
        return this == OWNER;
    }

    /**
     * Check if this role can change member roles.
     */
    public boolean canChangeRoles() {
        return this == OWNER;
    }

    /**
     * Check if this role can create/edit expenses.
     */
    public boolean canWriteExpenses() {
        return this != VIEWER;
    }
}
