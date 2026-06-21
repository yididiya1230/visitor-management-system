CREATE TABLE "Departments" (
    "Id" uuid NOT NULL,
    "Name" character varying(200) NOT NULL,
    "Description" character varying(500),
    "CreatedAt" timestamp with time zone NOT NULL,
    "UpdatedAt" timestamp with time zone,
    "IsDeleted" boolean NOT NULL,
    "CreatedById" text,
    "UpdatedById" text,
    CONSTRAINT "PK_Departments" PRIMARY KEY ("Id")
);


CREATE TABLE "Roles" (
    "Id" uuid NOT NULL,
    "Name" character varying(50) NOT NULL,
    "Description" character varying(200),
    "CreatedAt" timestamp with time zone NOT NULL,
    "UpdatedAt" timestamp with time zone,
    "IsDeleted" boolean NOT NULL,
    "CreatedById" text,
    "UpdatedById" text,
    CONSTRAINT "PK_Roles" PRIMARY KEY ("Id")
);


CREATE TABLE "Visitors" (
    "Id" uuid NOT NULL,
    "FirstName" character varying(100) NOT NULL,
    "LastName" character varying(100) NOT NULL,
    "Email" character varying(200),
    "PhoneNumber" character varying(20) NOT NULL,
    "Company" character varying(200),
    "PhotoUrl" character varying(500),
    "IdCardNumber" character varying(50),
    "Address" character varying(500),
    "CreatedAt" timestamp with time zone NOT NULL,
    "UpdatedAt" timestamp with time zone,
    "IsDeleted" boolean NOT NULL,
    "CreatedById" text,
    "UpdatedById" text,
    CONSTRAINT "PK_Visitors" PRIMARY KEY ("Id")
);


CREATE TABLE "Users" (
    "Id" uuid NOT NULL,
    "Username" character varying(100) NOT NULL,
    "Email" character varying(200) NOT NULL,
    "PasswordHash" text NOT NULL,
    "FullName" character varying(200) NOT NULL,
    "PhoneNumber" character varying(20),
    "IsActive" boolean NOT NULL,
    "RefreshToken" text,
    "RefreshTokenExpiryTime" timestamp with time zone,
    "RoleId" uuid NOT NULL,
    "CreatedAt" timestamp with time zone NOT NULL,
    "UpdatedAt" timestamp with time zone,
    "IsDeleted" boolean NOT NULL,
    "CreatedById" text,
    "UpdatedById" text,
    CONSTRAINT "PK_Users" PRIMARY KEY ("Id"),
    CONSTRAINT "FK_Users_Roles_RoleId" FOREIGN KEY ("RoleId") REFERENCES "Roles" ("Id") ON DELETE RESTRICT
);


CREATE TABLE "AuditLogs" (
    "Id" uuid NOT NULL,
    "Action" character varying(100) NOT NULL,
    "EntityName" character varying(100) NOT NULL,
    "EntityId" character varying(50),
    "Details" text,
    "IpAddress" character varying(50),
    "Timestamp" timestamp with time zone NOT NULL,
    "UserId" uuid,
    "CreatedAt" timestamp with time zone NOT NULL,
    "UpdatedAt" timestamp with time zone,
    "IsDeleted" boolean NOT NULL,
    "CreatedById" text,
    "UpdatedById" text,
    CONSTRAINT "PK_AuditLogs" PRIMARY KEY ("Id"),
    CONSTRAINT "FK_AuditLogs_Users_UserId" FOREIGN KEY ("UserId") REFERENCES "Users" ("Id") ON DELETE SET NULL
);


CREATE TABLE "Hosts" (
    "Id" uuid NOT NULL,
    "EmployeeCode" character varying(50) NOT NULL,
    "JobTitle" character varying(200) NOT NULL,
    "UserId" uuid NOT NULL,
    "DepartmentId" uuid NOT NULL,
    "CreatedAt" timestamp with time zone NOT NULL,
    "UpdatedAt" timestamp with time zone,
    "IsDeleted" boolean NOT NULL,
    "CreatedById" text,
    "UpdatedById" text,
    CONSTRAINT "PK_Hosts" PRIMARY KEY ("Id"),
    CONSTRAINT "FK_Hosts_Departments_DepartmentId" FOREIGN KEY ("DepartmentId") REFERENCES "Departments" ("Id") ON DELETE RESTRICT,
    CONSTRAINT "FK_Hosts_Users_UserId" FOREIGN KEY ("UserId") REFERENCES "Users" ("Id") ON DELETE RESTRICT
);


CREATE TABLE "Visits" (
    "Id" uuid NOT NULL,
    "Purpose" character varying(500) NOT NULL,
    "CheckInTime" timestamp with time zone,
    "CheckOutTime" timestamp with time zone,
    "Status" integer NOT NULL,
    "Notes" character varying(1000),
    "BadgeCode" character varying(50),
    "VisitorId" uuid NOT NULL,
    "HostId" uuid NOT NULL,
    "CheckedInById" uuid,
    "CheckedOutById" uuid,
    "CreatedAt" timestamp with time zone NOT NULL,
    "UpdatedAt" timestamp with time zone,
    "IsDeleted" boolean NOT NULL,
    "CreatedById" text,
    "UpdatedById" text,
    CONSTRAINT "PK_Visits" PRIMARY KEY ("Id"),
    CONSTRAINT "FK_Visits_Hosts_HostId" FOREIGN KEY ("HostId") REFERENCES "Hosts" ("Id") ON DELETE RESTRICT,
    CONSTRAINT "FK_Visits_Visitors_VisitorId" FOREIGN KEY ("VisitorId") REFERENCES "Visitors" ("Id") ON DELETE RESTRICT
);


CREATE INDEX "IX_AuditLogs_Timestamp" ON "AuditLogs" ("Timestamp");


CREATE INDEX "IX_AuditLogs_UserId" ON "AuditLogs" ("UserId");


CREATE UNIQUE INDEX "IX_Departments_Name" ON "Departments" ("Name");


CREATE INDEX "IX_Hosts_DepartmentId" ON "Hosts" ("DepartmentId");


CREATE UNIQUE INDEX "IX_Hosts_EmployeeCode" ON "Hosts" ("EmployeeCode");


CREATE UNIQUE INDEX "IX_Hosts_UserId" ON "Hosts" ("UserId");


CREATE UNIQUE INDEX "IX_Roles_Name" ON "Roles" ("Name");


CREATE UNIQUE INDEX "IX_Users_Email" ON "Users" ("Email");


CREATE INDEX "IX_Users_RoleId" ON "Users" ("RoleId");


CREATE UNIQUE INDEX "IX_Users_Username" ON "Users" ("Username");


CREATE UNIQUE INDEX "IX_Visitors_IdCardNumber" ON "Visitors" ("IdCardNumber") WHERE "IdCardNumber" IS NOT NULL;


CREATE INDEX "IX_Visits_CheckInTime" ON "Visits" ("CheckInTime");


CREATE INDEX "IX_Visits_HostId" ON "Visits" ("HostId");


CREATE INDEX "IX_Visits_Status" ON "Visits" ("Status");


CREATE INDEX "IX_Visits_VisitorId" ON "Visits" ("VisitorId");


