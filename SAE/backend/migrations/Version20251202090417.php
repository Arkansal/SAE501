<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20251202090417 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE animal (id INT NOT NULL, common_name VARCHAR(100) DEFAULT NULL, scientific_name VARCHAR(200) NOT NULL, family VARCHAR(100) DEFAULT NULL, type VARCHAR(100) DEFAULT NULL, image JSON DEFAULT NULL, extinct_level VARCHAR(50) NOT NULL, PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE animal_country (origin VARCHAR(50) DEFAULT NULL, presence_type VARCHAR(50) DEFAULT NULL, animal_id INT NOT NULL, code_iso VARCHAR(2) NOT NULL, INDEX IDX_DCACA65C8E962C16 (animal_id), INDEX IDX_DCACA65C897848EB (code_iso), PRIMARY KEY (animal_id, code_iso)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE animal_environment (animal_id INT NOT NULL, environment_id VARCHAR(10) NOT NULL, INDEX IDX_E19C0D9B8E962C16 (animal_id), INDEX IDX_E19C0D9B903E3A94 (environment_id), PRIMARY KEY (animal_id, environment_id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE country (code_iso VARCHAR(2) NOT NULL, country_name VARCHAR(50) NOT NULL, PRIMARY KEY (code_iso)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE environment (environment_id VARCHAR(10) NOT NULL, environment_name VARCHAR(100) NOT NULL, environment_type VARCHAR(255) DEFAULT NULL, PRIMARY KEY (environment_id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE favorite (animal_id INT NOT NULL, user_id INT NOT NULL, INDEX IDX_68C58ED98E962C16 (animal_id), INDEX IDX_68C58ED9A76ED395 (user_id), PRIMARY KEY (animal_id, user_id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE user (id INT AUTO_INCREMENT NOT NULL, email VARCHAR(180) NOT NULL, roles JSON NOT NULL, password VARCHAR(255) NOT NULL, pseudo VARCHAR(50) DEFAULT NULL, UNIQUE INDEX UNIQ_IDENTIFIER_EMAIL (email), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE messenger_messages (id BIGINT AUTO_INCREMENT NOT NULL, body LONGTEXT NOT NULL, headers LONGTEXT NOT NULL, queue_name VARCHAR(190) NOT NULL, created_at DATETIME NOT NULL, available_at DATETIME NOT NULL, delivered_at DATETIME DEFAULT NULL, INDEX IDX_75EA56E0FB7336F0 (queue_name), INDEX IDX_75EA56E0E3BD61CE (available_at), INDEX IDX_75EA56E016BA31DB (delivered_at), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('ALTER TABLE animal_country ADD CONSTRAINT FK_DCACA65C8E962C16 FOREIGN KEY (animal_id) REFERENCES animal (id)');
        $this->addSql('ALTER TABLE animal_country ADD CONSTRAINT FK_DCACA65C897848EB FOREIGN KEY (code_iso) REFERENCES country (code_iso)');
        $this->addSql('ALTER TABLE animal_environment ADD CONSTRAINT FK_E19C0D9B8E962C16 FOREIGN KEY (animal_id) REFERENCES animal (id)');
        $this->addSql('ALTER TABLE animal_environment ADD CONSTRAINT FK_E19C0D9B903E3A94 FOREIGN KEY (environment_id) REFERENCES environment (environment_id)');
        $this->addSql('ALTER TABLE favorite ADD CONSTRAINT FK_68C58ED98E962C16 FOREIGN KEY (animal_id) REFERENCES animal (id)');
        $this->addSql('ALTER TABLE favorite ADD CONSTRAINT FK_68C58ED9A76ED395 FOREIGN KEY (user_id) REFERENCES user (id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE animal_country DROP FOREIGN KEY FK_DCACA65C8E962C16');
        $this->addSql('ALTER TABLE animal_country DROP FOREIGN KEY FK_DCACA65C897848EB');
        $this->addSql('ALTER TABLE animal_environment DROP FOREIGN KEY FK_E19C0D9B8E962C16');
        $this->addSql('ALTER TABLE animal_environment DROP FOREIGN KEY FK_E19C0D9B903E3A94');
        $this->addSql('ALTER TABLE favorite DROP FOREIGN KEY FK_68C58ED98E962C16');
        $this->addSql('ALTER TABLE favorite DROP FOREIGN KEY FK_68C58ED9A76ED395');
        $this->addSql('DROP TABLE animal');
        $this->addSql('DROP TABLE animal_country');
        $this->addSql('DROP TABLE animal_environment');
        $this->addSql('DROP TABLE country');
        $this->addSql('DROP TABLE environment');
        $this->addSql('DROP TABLE favorite');
        $this->addSql('DROP TABLE user');
        $this->addSql('DROP TABLE messenger_messages');
    }
}
