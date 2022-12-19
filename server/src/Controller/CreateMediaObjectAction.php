<?php
// api/src/Controller/CreateMediaObjectAction.php

namespace App\Controller;

use App\Entity\MediaObject;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;

final class CreateMediaObjectAction
{
    public function __invoke(Request $request): MediaObject
    {
        $uploadedFile = $request->files->get('file');
        if (!$uploadedFile) {
            throw new BadRequestHttpException('"file" is required');
        }

        $mediaObject = new MediaObject();
        $fileName = $request->get('fileName');
        if($fileName != null) {
            $mediaObject->fileName = $fileName;
        }
        $authorId = $request->get('author');
        if($authorId != null) {
            $mediaObject->author = $authorId;
        }
        $mediaObject->file = $uploadedFile;

        return $mediaObject;
    }
}