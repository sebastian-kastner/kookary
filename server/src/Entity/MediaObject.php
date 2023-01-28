<?php

namespace App\Entity;

use App\Controller\CreateMediaObjectAction;

use Doctrine\ORM\Mapping as ORM;

use ApiPlatform\Core\Annotation\ApiProperty;
use ApiPlatform\Core\Annotation\ApiResource;

use Symfony\Component\HttpFoundation\File\File;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

use Vich\UploaderBundle\Mapping\Annotation as Vich;


/**
 * MediaObject
 * 
 * @ORM\Entity()
 * 
 * @Vich\Uploadable
 */
#[ApiResource(
    iri: 'https://schema.org/MediaObject',
    normalizationContext: ['groups' => ['media_object:read']],
    itemOperations: [
        'get',
        "delete" => ["security" => "is_granted('ROLE_ADMIN') or object.author == user"],
    ],
    collectionOperations: [
        'get',
        'post' => [
            "security" => "is_granted('ROLE_USER')",
            'controller' => CreateMediaObjectAction::class,
            'deserialize' => false,
            'validation_groups' => ['Default', 'media_object_create'],
            'openapi_context' => [
                'requestBody' => [
                    'content' => [
                        'multipart/form-data' => [
                            'schema' => [
                                'type' => 'object',
                                'properties' => [
                                    'file' => [
                                        'type' => 'string',
                                        'format' => 'binary',
                                    ],
                                    'fileName' => [
                                        'type' => 'string',
                                        'format' => 'string',
                                    ],
                                    'author' => [
                                        'type' => 'integer',
                                        'format' => 'integer',
                                    ]
                                ],
                            ],
                        ],
                    ],
                ],
            ],
        ],
    ]
)]
class MediaObject
{
    /**
     * @var int
     *
     * @ORM\Column(name="media_object_id", type="integer", nullable=false)
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="IDENTITY")
     */
    protected $mediaObjectId;

    /**
     * @var string|null
     *
     * @ORM\Column(name="file_path", type="string", length=300, nullable=true)
     */
    public $filePath;

    /**
     * @var string|null
     */
    #[ApiProperty(iri: 'https://schema.org/contentUrl')]
    #[Groups(['media_object:read'])]
    public $contentUrl;

    /**
     * @var string|null
     */
    #[Groups(['media_object:read'])]
    public $fileName;

    /**
     * @var File|null
     *
     * @Assert\NotNull(groups={"media_object_create"})
     * @Vich\UploadableField(mapping="media_object", fileNameProperty="filePath")
     */
    public $file;

    /**
     * @var integer
     * @ORM\Column(name="author_id")
     * @Groups({"media_object_read"})
     */
    public $author;

    public function getMediaObjectId(): ?int
    {
        return $this->mediaObjectId;
    }

    public function getFilePath(): ?string
    {
        return $this->filePath;
    }

    public function setFilePath(?string $filePath): self
    {
        $this->filePath = $filePath;

        return $this;
    }

    public function getAuthor(): ?string
    {
        return $this->author;
    }

    public function setAuthor(string $author): self
    {
        $this->author = $author;

        return $this;
    }

}