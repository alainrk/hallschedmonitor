<?php

if ($handle = opendir('../html/images/')) {
    while (false !== ($file = readdir($handle)))
    {
        if ($file != "." && $file != ".." /* && strtolower(substr($file, strrpos($file, '.') + 1)) == 'jpg'*/)
        {
            $list .= $file.'&';
        }
    }
    closedir($handle);
}

header('Content-type: text/plain');
print $list;
die();
