-- CreateTable
CREATE TABLE "Assistant" (
    "id" TEXT NOT NULL,
    "assistantId" TEXT NOT NULL,
    "usuarioId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Assistant_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Assistant_assistantId_key" ON "Assistant"("assistantId");

-- AddForeignKey
ALTER TABLE "Assistant" ADD CONSTRAINT "Assistant_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
