<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use Doctrine\ORM\Mapping\UniqueConstraint;
use ApiPlatform\Core\Annotation\ApiResource;
use ApiPlatform\Core\Annotation\ApiProperty;

/**
 * Tag
 */
#[ORM\Entity]
#[ORM\Table(name: "tag")]
#[UniqueConstraint(name: "name", columns: ["name"])]
#[ApiResource(
    attributes: [ "pagination_enabled" => false ],
    collectionOperations: [
        "get",
        "post" => ["security" => "is_granted('ROLE_USER')"],
    ],
    itemOperations: [
        "get",
        "put" => ["security" => "is_granted('ROLE_ADMIN') or object.author == user"],
        "patch" => ["security" => "is_granted('ROLE_ADMIN') or object.author == user"],
        "delete" => ["security" => "is_granted('ROLE_ADMIN') or object.author == user"],
    ]
)]
class Tag
{
    /**
     * @var int
     */
    #[ORM\Id]
    #[ORM\Column(name: "tag_id", type: "integer", nullable: false)]
    #[ORM\GeneratedValue(strategy: "IDENTITY")]
    #[ApiProperty(identifier: true)]
    private $tagId;

    /**
     * @var string
     */
    #[ORM\Column(name: "name", type: "string", length: 100, nullable: false)]
    private $name;

    /**
     * @var User
     */
    #[ORM\ManyToOne(targetEntity: "User")]
    #[ORM\JoinColumn(name: "author_id", referencedColumnName: "id", nullable: false)]
    public $author;

    public function __construct()
    {
    }

    public function getTagId(): ?int
    {
        return $this->tagId;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): self
    {
        $this->name = $name;

        return $this;
    }

    public function getAuthor(): ?User
    {
        return $this->author;
    }

    public function setAuthor(?User $author): self
    {
        $this->author = $author;

        return $this;
    }
}