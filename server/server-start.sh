#!/bin/bash
set -e

php bin/console cache:clear
symfony server:start