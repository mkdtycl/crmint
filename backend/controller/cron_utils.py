"""Utilities to deal with cron formats.

Inspired from the pycron library, but simplified the implementation.
Source: https://github.com/kipe/pycron
License: MIT
"""

from croniter import croniter
from datetime import datetime


def _to_int(value) -> int:
  """Returns an integer from the given parsed value.

  Args:
    value: Value to convert to integer.

  Raises:
    ValueError: if the value cannot be parsed.
  """
  if isinstance(value, int) or (isinstance(value, str) and value.isnumeric()):
    return int(value)
  raise ValueError('Failed to parse string to integer')


def _parse_arg(value: str, target: int) -> bool:
  """Returns True if the target matches the value cron.

  Args:
    value: Cron part
    target: Integer to match the cron with.

  Raises:
    ValueError: if the value contains unsupported syntax.
  """
  value = value.strip()
  if value == '*':
    return True

  if '-' in value:
    raise ValueError('Unsupported syntax used in cron: "-"')

  if '/' in value:
    raise ValueError('Unsupported syntax used in cron: "/"')

  values = filter(None, [x.strip() for x in value.split(',')])
  for value in values:
    if _to_int(value) == target:
      return True
  return False


def cron_match(cron: str, dt: datetime = None) -> bool:
  """Returns True if a date falls into a cron schedule.

  Args:
    cron: Cron-like string (minute, hour, day of month, month, day of week).
    dt: Datetime to use as reference time, defaults to `datetime.utcnow()`.
  """
  if dt is None:
    dt = datetime.utcnow()
  minute, hour, dom, month, dow = cron.strip().split(' ')
  weekday = dt.isoweekday()
  conditions = [
      _parse_arg(minute, dt.minute),
      _parse_arg(hour, dt.hour),
      _parse_arg(dom, dt.day),
      _parse_arg(month, dt.month),
      _parse_arg(dow, 0 if weekday == 7 else weekday),
  ]
  return all(conditions)


def is_valid_cron(cron_expression: str) -> bool:
  """Validates a strict 5-part cron expression.

  Args:
    cron_expression: The cron expression as a string.

  Returns:
    True if the cron expression is valid, False otherwise.
  """
  # Trim whitespace and check if the expression is empty or only whitespace
  cron_expression = cron_expression.strip()
  if not cron_expression:
    return False

  # Check for exactly five parts in the cron expression
  parts = cron_expression.strip().split()
  if len(parts) != 5:
    return False

  try:
    croniter(cron_expression, datetime.now())
    return True
  except (KeyError, ValueError):
    return False
