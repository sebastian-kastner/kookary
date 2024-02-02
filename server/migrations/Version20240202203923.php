<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240202203923 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE seasonality_score (seasonality_score_id INT AUTO_INCREMENT NOT NULL, recipe_id INT DEFAULT NULL, month INT DEFAULT NULL, separator_label NUMERIC(5, 2) DEFAULT NULL, INDEX FK_recipe_seasonality_score (recipe_id), PRIMARY KEY(seasonality_score_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE seasonality_score ADD CONSTRAINT FK_CA3A663659D8A214 FOREIGN KEY (recipe_id) REFERENCES recipe (recipe_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE seasonality_score DROP FOREIGN KEY FK_CA3A663659D8A214');
        $this->addSql('DROP TABLE seasonality_score');
    }
}
