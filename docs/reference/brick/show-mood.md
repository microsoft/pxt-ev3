# show Mood

Show a mood on the brick. A mood will have a image on the display along with a sound and solid or flashing light.

```sig
brick.showMood(moods.sleeping)
```
You can choose one of several moods to show on the display. Use a mood to help show what your @boardname@ is doing at the moment.

## Parameters

**mood**: A mood to show on the brick. Choose one of these moods:
>* ``sleeping``
* ``awake``
* ``tired``
* ``angry``
* ``sad``
* ``dizzy``
* ``knockedOut``
* ``middleLeft``
* ``middleRight``
* ``love``
* ``winking``
* ``neutral``


## Example

Show a ``winking`` mood on the brick.

```blocks
brick.showMood(moods.winking)
```

## See also

[show image](/reference/brick/show-image)