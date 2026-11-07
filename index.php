<?php
/**
 * Colossus Q - Production Web Entry
 * Serves the production homepage on PHP-based hosting stacks (Cloudways, Apache, Nginx).
 */
header('Content-Type: text/html; charset=UTF-8');
readfile(__DIR__ . '/index.html');
exit;
