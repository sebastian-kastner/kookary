<?php

namespace App\Naming;

use App\Entity\MediaObject;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Vich\UploaderBundle\FileAbstraction\ReplacingFile;
use Vich\UploaderBundle\Mapping\PropertyMapping;
use Vich\UploaderBundle\Util\Transliterator;
use Vich\UploaderBundle\Naming\NamerInterface;
use Vich\UploaderBundle\Naming\ConfigurableInterface;

/**
 * OrignameNamer.
 *
 * @author Ivan Borzenkov <ivan.borzenkov@gmail.com>
 * @final
 */
class OrignameNamer implements NamerInterface, ConfigurableInterface
{
    /**
     * @var bool
     */
    private $transliterate = false;

    /**
     * @var Transliterator
     */
    private $transliterator;

    public function __construct(Transliterator $transliterator)
    {
        $this->transliterator = $transliterator;
    }

    /**
     * @param array $options Options for this namer. The following options are accepted:
     *                       - transliterate: whether the filename should be transliterated or not
     */
    public function configure(array $options): void
    {
        $this->transliterate = isset($options['transliterate']) ? (bool) $options['transliterate'] : $this->transliterate;
    }

    public function name($object, PropertyMapping $mapping): string
    {
        /* @var $file UploadedFile|ReplacingFile */
        $file = $mapping->getFile($object);
        $originalName = $file->getClientOriginalName();
        $name = $originalName;

        if ($object instanceof MediaObject && $object->fileName !== null) {
            $file_ending = $this->get_file_ending($originalName);
            $sanitized_file_name = $this->sanitize_file_name(($object->fileName));
            $name = $sanitized_file_name . "." . $file_ending;
        }

        if ($this->transliterate) {
            $name = $this->transliterator->transliterate($name);
        }

        return \uniqid().'_'.$name;
    }

    // see: https://gist.github.com/sumanthkumarc/2de2e2cc06c648a9f52c121501a181df
    function sanitize_file_name($unsafeFilename){
        // our list of "unsafe characters", add/remove characters if necessary
        $dangerousCharacters = array(" ", '"', "'", "&", "/", "\\", "?", "#");
        // every forbidden character is replaced by an underscore
        $safe_filename = str_replace($dangerousCharacters, '_', $unsafeFilename);
        return $safe_filename;
      }

    private function get_file_ending($fileName) {
        $parts = explode('.', $fileName);
        return end($parts);
    }
}
