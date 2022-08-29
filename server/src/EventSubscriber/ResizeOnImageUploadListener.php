<?php

namespace App\EventSubscriber;

use App\Entity\MediaObject;
use Vich\UploaderBundle\Event\Event;
use Gumlet\ImageResize;

class ResizeOnImageUploadListener
{
    const MAX_WIDTH = 1100;
    const MAX_HEIGHT = 650;

    public function onVichUploaderPostUpload(Event $event)
    {
        $object = $event->getObject();

        // only resize MediaObjects
        if ($object instanceof MediaObject) {
            $fullPath = $object->file->getRealPath();
            $image = new ImageResize($object->file->getRealPath());
            $image->resizeToWidth(1100);
            $image->resizeToHeight(650);
            $image->save($fullPath);
        }
    }
}

?>