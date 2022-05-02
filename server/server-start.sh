#!/bin/bash
set -e

echo "Cleaning var folder.."
rm -rf var

echo "Starting server.."
symfony server:start